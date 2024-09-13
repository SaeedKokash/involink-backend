const { Invoice, Store, Contact, InvoiceItem, RequestToPay, 
  // InvoiceItemTax, InvoiceHistory 
} = require('../models');

// Create a new invoice
exports.createInvoice = async (req, res) => {
  const t = await sequelize.transaction(); // Use a transaction for consistency
  try {
    const {
      invoice_number,
      order_number,
      status,
      invoiced_at,
      due_at,
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
      invoice_items,  // Array of invoice items
      request_to_pay,  // RequestToPay data
    } = req.body;

    // Check if the store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if the contact exists
    const contact = await Contact.findByPk(contact_id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Create the invoice
    const newInvoice = await Invoice.create({
      invoice_number,
      order_number,
      status,
      invoiced_at,
      due_at,
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
    }, { transaction: t });

    // Create associated invoice items
    if (invoice_items && invoice_items.length > 0) {
      for (const item of invoice_items) {
        const newItem = await InvoiceItem.create({
          invoice_id: newInvoice.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        }, { transaction: t });

        // Create associated taxes for each item (InvoiceItemTax)
        // if (item.taxes && item.taxes.length > 0) {
        //   for (const tax of item.taxes) {
        //     await InvoiceItemTax.create({
        //       invoice_item_id: newItem.id,
        //       tax_id: tax.tax_id,
        //       amount: tax.amount,
        //     }, { transaction: t });
        //   }
        // }
      }
    }

    // Create RequestToPay entry if provided
    if (request_to_pay) {
      await RequestToPay.create({
        invoice_id: newInvoice.id,
        session_id: request_to_pay.session_id,
        msgId: request_to_pay.msgId,
        purpose: request_to_pay.purpose,
        amount: request_to_pay.amount,
        receiverType: request_to_pay.receiverType,
        senderType: request_to_pay.senderType,
      }, { transaction: t });
    }

    // Create initial InvoiceHistory entry
    // await InvoiceHistory.create({
    //   invoice_id: newInvoice.id,
    //   status: 'created',
    //   description: `Invoice ${invoice_number} created.`,
    // }, { transaction: t });

    await t.commit();
    return res.status(201).json(newInvoice);
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
};

// Get all invoices for a store
exports.getInvoicesByStore = async (req, res) => {
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
exports.getInvoiceById = async (req, res) => {
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
exports.updateInvoice = async (req, res) => {
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
exports.deleteInvoice = async (req, res) => {
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
