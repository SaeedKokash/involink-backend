const fs = require('fs');
const logger = require('../config/logger');

const { sequelize, Invoice, Store, Contact, InvoiceItem, RequestToPay, Item, Tax, UserStore, InvoiceHistory, Media } = require('../models');
const { generateInvoiceNumber, generateInvoicePDF } = require('../services/invoiceServices');
const { sendInvoiceEmail } = require('../services/emailService');

// this should become a user-store middleware
function authorizeInvoiceCreation(req, res, next) {
  const user = req.user; // Assuming user is attached to req
  const storeId = req.body.store_id;

  // Check if user is associated with the store and has the right role
  UserStore.findOne({ where: { user_id: user.id, store_id: storeId } })
    .then((userStore) => {
      if (!userStore) {
        return res.status(403).json({ error: 'User not associated with the store.' });
      }
      if (userStore.user_type !== 'owner' && userStore.user_type !== 'employee') {
        return res.status(403).json({ error: 'Insufficient permissions.' });
      }
      next();
    })
    .catch((err) => next(err));
}

// Create a new invoice
exports.createInvoice = async (req, res, next) => {
  const transaction = await sequelize.transaction(); // Use a transaction for consistency
  try {
    const {
      invoice_number,
      order_number,
      status,
      invoiced_at,
      due_at,
      amount,
      currency_code,
      currency_rate = 1,
      contact_id,
      contact_name,
      contact_email,
      contact_tax_number,
      contact_phone,
      contact_address,
      notes,
      footer,
      store_id,
      invoice_items,  // Array of invoice items
      request_to_pay,  // RequestToPay data
    } = req.body;

    // NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW CHECK LATER
    // const {
    //   store_id,
    //   contact_id,
    //   items, // Array of items
    //   notes,
    //   invoiced_at,
    //   due_at,
    //   currency_code,
    //   currency_rate = 1,
    // } = req.body;

    // // Validate input
    // if (!store_id || !contact_id || !items || items.length === 0 || !currency_code) {
    //   return res.status(400).json({ message: 'Required fields are missing.' });
    // }


    // Check if user has access to the store
    const userStore = await UserStore.findOne({
      where: { user_id: req.user.id, store_id },
    });

    if (!userStore) {
      await transaction.rollback();
      next({ statusCode: 403, message: 'You are not authorized to access this resource' });
    }

    // Check if the contact exists
    const contact = await Contact.findByPk(contact_id);
    if (!contact) {
      await transaction.rollback();
      next({ statusCode: 404, message: 'Contact not found' });
    }

    // Generate invoice number if not provided
    if (!invoice_number) {
      const newInvoiceNumber = await generateInvoiceNumber(store_id);
      if (!newInvoiceNumber) {
        await transaction.rollback();
        next({ statusCode: 404, message: 'Error in generating invoice number, Store not found' });
      }
      invoice_number = newInvoiceNumber;

      // another way to check and create, Generate unique invoice number (simple example)
      // const invoiceCount = await Invoice.count({ where: { store_id } });
      // const invoice_number = `INV-${store_id}-${invoiceCount + 1}`;
    }


    // Create the invoice
    const newInvoice = await Invoice.create({
      invoice_number,
      order_number,
      status: 'draft',
      invoiced_at: invoiced_at || new Date(),
      due_at: due_at || new Date(),
      amount,
      currency_code,
      currency_rate,
      contact_id,
      contact_name,
      contact_email,
      contact_tax_number,
      contact_phone,
      contact_address,
      notes,
      footer,
      store_id,
    }, { transaction: transaction });

    // Calculate totals
    // let amount = 0;
    // for (const item of items) {
    //   const itemTotal = item.quantity * item.price;
    //   amount += itemTotal;
    // }

    let invoiceTotal = 0;
    for (const itemData of invoice_items) {
      const item = await Item.findOne({ where: { id: itemData, store_id: store_id } });

      const lineTotal = itemData.quantity * itemData.sale_price;
      const discountAmount = itemData.discount_type === 'percentage'
        ? (lineTotal * itemData.discount_rate) / 100
        : itemData.discount_rate;
      const taxableAmount = lineTotal - discountAmount;

      // Calculate taxes
      let taxAmount = 0;
      // for (const taxId of itemData.taxes) {
      //   const tax = await Tax.findOne({ where: { id: taxId, store_id: store_id } });
      //   const taxLineAmount = (taxableAmount * tax.rate) / 100;
      //   taxAmount += taxLineAmount;

      //   // Insert into invoice_item_taxes
      //   await InvoiceItemTax.create({
      //     store_id: store_id,
      //     invoice_id: newInvoice.id,
      //     invoice_item_id: invoiceItem.id,
      //     tax_id: tax.id,
      //     name: tax.name,
      //     amount: taxLineAmount,
      //     created_at: new Date(),
      //     updated_at: new Date(),
      //   }, { transaction });
      // }

      const totalAmount = taxableAmount + taxAmount;

      // Insert into invoice_items
      await InvoiceItem.create({
        store_id: store_id,
        invoice_id: newInvoice.id,
        item_id: item.id,
        name: item.name,
        sku: item.sku,
        quantity: itemData.quantity,
        price: itemData.price,
        total: totalAmount,
        tax: taxAmount,
        discount_rate: itemData.discount_rate,
        discount_type: itemData.discount_type,
      }, { transaction });

      invoiceTotal += totalAmount;
    }

    // another way to check and create, Generate unique invoice number (simple example)
    // Create invoice items

    // for (const item of invoice_items) {
    //   await InvoiceItem.create(
    //     {
    //       store_id,
    //       invoice_id: invoice.id,
    //       item_id: item.item_id,
    //       name: item.name,
    //       sku: item.sku,
    //       quantity: item.quantity,
    //       price: item.price,
    //       total: item.quantity * item.price,
    //       tax: item.tax || 0,
    //       discount_rate: item.discount_rate || 0,
    //       discount_type: item.discount_type || 'fixed',
    //     },
    //     { transaction: transaction  }
    //   );
    // }

    // Add to invoice histories
    await InvoiceHistory.create(
      {
        store_id,
        invoice_id: newInvoice.id,
        status: 'draft',
        notify: false,
        description: 'Invoice created.',
      },
      { transaction: transaction }
    );

      await transaction.commit();

      // Generate PDF and save in media table
      try {
        const pdfPath = await generateInvoicePDF(newInvoice.id);
      
        // Save PDF details in media table
        const media = await Media.create({
          disk: 'local',
          directory: 'invoices',
          filename: `invoice_${newInvoice.invoice_number}`,
          extension: 'pdf',
          mime_type: 'application/pdf',
          aggregate_type: 'document',
          size: fs.statSync(pdfPath).size,
        });
      
        // Associate media with invoice
        await newInvoice.addMedia(media, { through: { tag: 'invoice_pdf' } });
  
        // Move the PDF to the media directory
        fs.renameSync(pdfPath, `media/${media.id}`);
      } catch (error) {
        logger.error(`Error generating invoice PDF: ${error.message}`);

      }

      // try {
      //   await sendInvoiceEmail(newInvoice, pdfPath);
      // } catch (emailError) {
      //   console.error('Email Sending Error:', emailError);
      //   // Decide how to handle email errors (e.g., retry, log, etc.)

      //   // Log the error
      //   logger.error(`Error sending invoice email: ${emailError.message}`);

      //   // Return success response even if email sending fails
      //   return res.status(201).json(newInvoice);
      // }

    return res.status(201).json(newInvoice);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error creating invoice: ${error.message}`);
    next(error);
  }
};

  // Get all invoices for a store
  exports.getInvoicesByStore = async (req, res, next) => {
    try {
      const storeId = req.params.store_id;

      // Check if the store exists
      const store = await Store.findByPk(storeId);
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      // Retrieve all invoices for the store
      const invoices = await Invoice.findAll({
        where: { store_id: storeId },
        include: [{ model: Contact, attributes: ['name', 'email'] }],
      });

      return res.status(200).json(invoices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to retrieve invoices' });
    }
  };

  // Get a single invoice by ID, optionally include items, taxes, request-to-pay, and history
  exports.getInvoiceById = async (req, res, next) => {
    try {
      const invoiceId = req.params.invoice_id;
      const includeItems = req.query.includeItems === 'true'; // Optional query param

      // Fetch the invoice, optionally including associated items, taxes, request-to-pay, and history
      const invoice = await Invoice.findByPk(invoiceId, {
        include: [
          { model: Contact, attributes: ['name', 'email'] },
          ...(includeItems
            ? [
              {
                model: InvoiceItem,
                // include: [{ model: InvoiceItemTax }],
              },
              { model: RequestToPay },
              // { model: InvoiceHistory },
            ]
            : [])
        ],
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      return res.status(200).json(invoice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to retrieve invoice' });
    }
  };

  // Update an invoice
  exports.updateInvoice = async (req, res, next) => {
    try {
      const invoiceId = req.params.invoice_id;

      // Find the invoice by ID
      const invoice = await Invoice.findByPk(invoiceId);

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Update the invoice
      const updatedInvoice = await invoice.update(req.body);

      return res.status(200).json(updatedInvoice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update invoice' });
    }
  };

  // Delete an invoice (soft delete)
  exports.deleteInvoice = async (req, res, next) => {
    try {
      const invoiceId = req.params.invoice_id;

      // Find the invoice by ID
      const invoice = await Invoice.findByPk(invoiceId);

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Soft delete the invoice (if paranoid is enabled)
      await invoice.destroy();

      return res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete invoice' });
    }
  };
