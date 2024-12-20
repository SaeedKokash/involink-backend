const fs = require('fs');
const logger = require('../config/logger');

const { sequelize, Invoice, Store, Contact, InvoiceItem, RequestToPay, Item, Tax, UserStore, InvoiceHistory, Media, Mediable  } = require('../models');
const { generateInvoiceNumber, generateInvoicePDFHelper } = require('../services/invoiceServices');
const { sendInvoiceEmail } = require('../services/emailService');
const { Op } = require('sequelize');
const { paginate } = require('../utils/pagination');

const PDFDocument = require('pdfkit');

const path = require('path');

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
// exports.createInvoice = async (req, res, next) => {
//   const transaction = await sequelize.transaction(); // Use a transaction for consistency
//   try {
//     const {
//       invoice_number,
//       order_number,
//       status,
//       invoiced_at,
//       due_at,
//       amount,
//       currency_code,
//       currency_rate = 1,
//       contact_id,
//       contact_name,
//       contact_email,
//       contact_tax_number,
//       contact_phone,
//       contact_address,
//       notes,
//       footer,
//       invoice_items,  // Array of invoice items
//       request_to_pay,  // RequestToPay data
//     } = req.body;

//     const storeId = req.params.store_id;

//     console.log(req.body.store_id)

//     // NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW CHECK LATER
//     // const {
//     //   store_id,
//     //   contact_id,
//     //   items, // Array of items
//     //   notes,
//     //   invoiced_at,
//     //   due_at,
//     //   currency_code,
//     //   currency_rate = 1,
//     // } = req.body;

//     // // Validate input
//     // if (!store_id || !contact_id || !items || items.length === 0 || !currency_code) {
//     //   return res.status(400).json({ message: 'Required fields are missing.' });
//     // }


//     // Check if user has access to the store
//     const userStore = await UserStore.findOne({
//       where: { user_id: req.user.id, store_id: storeId },
//     });


//     if (!userStore) {
//       await transaction.rollback();
//       return next({ statusCode: 403, message: 'You are not authorized to access this resource' });
//     }

//     // Check if the contact exists
//     const contact = await Contact.findByPk(contact_id);
//     if (!contact) {
//       await transaction.rollback();
//       return next({ statusCode: 404, message: 'Contact not found' });
//     }

//     // Generate invoice number if not provided
//     if (!invoice_number) {
//       const newInvoiceNumber = await generateInvoiceNumber(storeId);
//       if (!newInvoiceNumber) {
//         await transaction.rollback();
//         return next({ statusCode: 404, message: 'Error in generating invoice number, Store not found' });
//       }
//       invoice_number = newInvoiceNumber;

//       // another way to check and create, Generate unique invoice number (simple example)
//       // const invoiceCount = await Invoice.count({ where: { store_id } });
//       // const invoice_number = `INV-${store_id}-${invoiceCount + 1}`;
//     }


//     // Create the invoice
//     const newInvoice = await Invoice.create({
//       invoice_number,
//       order_number,
//       status: status,
//       invoiced_at: invoiced_at || new Date(),
//       due_at: due_at || new Date(),
//       amount,
//       currency_code,
//       currency_rate,
//       contact_id,
//       contact_name,
//       contact_email,
//       contact_tax_number,
//       contact_phone,
//       contact_address,
//       notes,
//       footer,
//       store_id: storeId,
//     }, { transaction: transaction });

//     // Calculate totals
//     // let amount = 0;
//     // for (const item of items) {
//     //   const itemTotal = item.quantity * item.price;
//     //   amount += itemTotal;
//     // }

//     let invoiceTotal = 0;
//     for (const itemData of invoice_items) {
//       // console.log("itemData================================================================================================", itemData)
//       const item = await Item.findOne({ where: { id: itemData.item_id, store_id: storeId } });

//       // console.log("items================================================================================================", item)

//       const lineTotal = itemData.quantity * itemData.sale_price;
//       const discountAmount = itemData.discount_type === 'percentage'
//         ? (lineTotal * itemData.discount_rate) / 100
//         : itemData.discount_rate;
//       const taxableAmount = lineTotal - discountAmount;

//       // Calculate taxes
//       let taxAmount = 0;
//       // for (const taxId of itemData.taxes) {
//       //   const tax = await Tax.findOne({ where: { id: taxId, store_id: storeId } });
//       //   const taxLineAmount = (taxableAmount * tax.rate) / 100;
//       //   taxAmount += taxLineAmount;

//       //   // Insert into invoice_item_taxes
//       //   await InvoiceItemTax.create({
//       //     store_id: storeId,
//       //     invoice_id: newInvoice.id,
//       //     invoice_item_id: invoiceItem.id,
//       //     tax_id: tax.id,
//       //     name: tax.name,
//       //     amount: taxLineAmount,
//       //     created_at: new Date(),
//       //     updated_at: new Date(),
//       //   }, { transaction });
//       // }

//       const totalAmount = taxableAmount + taxAmount;

//       // Insert into invoice_items
//       await InvoiceItem.create({
//         store_id: storeId,
//         invoice_id: newInvoice.id,
//         item_id: item.id,
//         name: item.name,
//         sku: item.sku,
//         quantity: itemData.quantity,
//         price: itemData.price,
//         total: totalAmount,
//         tax: taxAmount,
//         discount_rate: itemData.discount_rate,
//         discount_type: itemData.discount_type,
//       }, { transaction });

//       invoiceTotal += totalAmount;
//     }

//     // another way to check and create, Generate unique invoice number (simple example)
//     // Create invoice items

//     // for (const item of invoice_items) {
//     //   await InvoiceItem.create(
//     //     {
//     //       store_id: storeId,
//     //       invoice_id: invoice.id,
//     //       item_id: item.item_id,
//     //       name: item.name,
//     //       sku: item.sku,
//     //       quantity: item.quantity,
//     //       price: item.price,
//     //       total: item.quantity * item.price,
//     //       tax: item.tax || 0,
//     //       discount_rate: item.discount_rate || 0,
//     //       discount_type: item.discount_type || 'fixed',
//     //     },
//     //     { transaction: transaction  }
//     //   );
//     // }

//     // Add to invoice histories
//     await InvoiceHistory.create(
//       {
//         store_id: storeId,
//         invoice_id: newInvoice.id,
//         status: 'draft',
//         notify: false,
//         description: 'Invoice created.',
//       },
//       { transaction: transaction }
//     );

//       await transaction.commit();

//       // Generate PDF and save in media table
//       try {
//         const pdfPath = await generateInvoicePDFHelper(newInvoice.id);

//           // Ensure the file exists before accessing it
//             if (!fs.existsSync(pdfPath)) {
//               throw new Error(`PDF file not found at path: ${pdfPath}`);
//             }
                
//         // Save PDF details in media table
//         const media = await Media.create({
//           disk: 'local',
//           directory: 'invoices',
//           filename: `invoice_${newInvoice.invoice_number}.pdf`,
//           extension: 'pdf',
//           mime_type: 'application/pdf',
//           aggregate_type: 'document',
//           size: fs.statSync(pdfPath).size,
//           path: pdfPath, // Add the path field
//         });

//         console.log('Media created:', media);
      
//         // Associate media with invoice
//         // await newInvoice.addMedia(media, { through: { tag: 'invoice_pdf' } });
//         await Mediable.create({
//           media_id: media.id,
//           mediable_type: 'Invoice',
//           mediable_id: newInvoice.id,
//           tag: 'invoice_pdf',
//         });
  
//         // Move the PDF to the media directory
//         // No need to move the PDF file since it's already in the correct location
//         // fs.renameSync(pdfPath, `media/${media.id}`);
//       } catch (error) {
//         console.log(error)
//         logger.error(`Error generating invoice PDF: ${error.message}`);

//       }

//       // try {
//       //   await sendInvoiceEmail(newInvoice, pdfPath);
//       // } catch (emailError) {
//       //   console.error('Email Sending Error:', emailError);
//       //   // Decide how to handle email errors (e.g., retry, log, etc.)

//       //   // Log the error
//       //   logger.error(`Error sending invoice email: ${emailError.message}`);

//       //   // Return success response even if email sending fails
//       //   return res.status(201).json(newInvoice);
//       // }

//     return res.status(201).json(newInvoice);
//   } catch (error) {
//     await transaction.rollback();
//     logger.error(`Error creating invoice: ${error.message}`);
//     next(error);
//   }
// };

exports.createInvoice = async (req, res, next) => {
  // console.log("here in create invoice")
  // console.log("params", req.params)
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
      invoice_items,  // Array of invoice items
      request_to_pay,  // RequestToPay data
    } = req.body;

    const storeId = req.params.store_id;

    // console.log("params", req.params)
    // console.log(storeId)

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
      where: { user_id: req.user.id, store_id: storeId },
    });


    if (!userStore) {
      await transaction.rollback();
      return next({ statusCode: 403, message: 'You are not authorized to access this resource' });
    }

    // Check if the contact exists
    const contact = await Contact.findByPk(contact_id);
    if (!contact) {
      await transaction.rollback();
      return next({ statusCode: 404, message: 'Contact not found' });
    }

    // Generate invoice number if not provided
    if (!invoice_number) {
      const newInvoiceNumber = await generateInvoiceNumber(store_id);
      if (!newInvoiceNumber) {
        await transaction.rollback();
        return next({ statusCode: 404, message: 'Error in generating invoice number, Store not found' });
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
      store_id: storeId,
    }, { transaction: transaction });

    // Calculate totals
    // let amount = 0;
    // for (const item of items) {
    //   const itemTotal = item.quantity * item.price;
    //   amount += itemTotal;
    // }

    let invoiceTotal = 0;
    for (const itemData of invoice_items) {
      // console.log("itemData================================================================================================", itemData)
      const item = await Item.findOne({ where: { id: itemData.item_id, store_id: storeId } });

      // console.log("items================================================================================================", item)

      const lineTotal = itemData.quantity * itemData.sale_price;
      const discountAmount = itemData.discount_type === 'percentage'
        ? (lineTotal * itemData.discount_rate) / 100
        : itemData.discount_rate;
      const taxableAmount = lineTotal - discountAmount;

      // Calculate taxes
      let taxAmount = 0;
      // for (const taxId of itemData.taxes) {
      //   const tax = await Tax.findOne({ where: { id: taxId, store_id: storeId } });
      //   const taxLineAmount = (taxableAmount * tax.rate) / 100;
      //   taxAmount += taxLineAmount;

      //   // Insert into invoice_item_taxes
      //   await InvoiceItemTax.create({
      //     store_id: storeId,
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
        store_id: storeId,
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
    //       store_id: storeId,
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
        store_id: storeId,
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
        const pdfPath = await generateInvoicePDFHelper(newInvoice.id);

          // Ensure the file exists before accessing it
            if (!fs.existsSync(pdfPath)) {
              throw new Error(`PDF file not found at path: ${pdfPath}`);
            }
                
        // Save PDF details in media table
        const media = await Media.create({
          disk: 'local',
          directory: 'invoices',
          filename: `invoice_${newInvoice.invoice_number}.pdf`,
          extension: 'pdf',
          mime_type: 'application/pdf',
          aggregate_type: 'document',
          size: fs.statSync(pdfPath).size,
          path: pdfPath, // Add the path field
        });

        console.log('Media created:', media);
      
        // Associate media with invoice
        // await newInvoice.addMedia(media, { through: { tag: 'invoice_pdf' } });
        await Mediable.create({
          media_id: media.id,
          mediable_type: 'Invoice',
          mediable_id: newInvoice.id,
          tag: 'invoice_pdf',
        });
  
        // Move the PDF to the media directory
        // No need to move the PDF file since it's already in the correct location
        // fs.renameSync(pdfPath, `media/${media.id}`);
      } catch (error) {
        console.log(error)
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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10; // Optional: Allow dynamic limit
        const search = req.query.search || '';
        const status = req.query.status || '';

        // Construct the WHERE clause with dynamic filters
        const where = {
            store_id: storeId,
            ...(search && {
                [Op.or]: [
                    { invoice_number: { [Op.iLike]: `%${search}%` } },
                    { contact_name: { [Op.iLike]: `%${search}%` } },
                ],
            }),
            ...(status && { status }),
        };

        // Define additional Sequelize options
        const options = {
            include: [
                {
                    model: Contact,
                },
                {
                    model: InvoiceItem,
                    include: [
                        {
                            model: Item,
                            include: [
                                {
                                    model: Tax,
                                },
                            ],
                        },
                    ],
                }
            ],
            // You can add more options like distinct if needed
            // distinct: true,
        };

        // Call the enhanced paginate function
        const result = await paginate({
            model: Invoice,
            page,
            limit,
            where,
            options,
        });

        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Error retrieving invoices: ${error.message}`);
        next(error);
    }
};

  // Get a single invoice by ID, optionally include items, taxes, request-to-pay, and history
  exports.getInvoiceById = async (req, res, next) => {
    try {
      const invoiceId = req.params.invoice_id;
      const includeItems = req.query.includeItems === 'true'; // Optional query param

      // Fetch the invoice, optionally including associated items, taxes, request-to-pay, and history
      // const invoice = await Invoice.findByPk(invoiceId, {
      //   include: [
      //     { model: Contact },
      //     ...(includeItems
      //       ? [
      //         {
      //           model: InvoiceItem,
      //           // include: [{ model: InvoiceItemTax }],
      //         },
      //         { model: RequestToPay },
      //         // { model: InvoiceHistory },
      //       ]
      //       : [])
      //   ],
      // });

      const invoice = await Invoice.findByPk(invoiceId, {
        include: [
          {
            model: Contact,
            attributes: ['id', 'name', 'email', 'phone', 'address'],
          },
          {
            model: InvoiceItem,
            include: [
              {
                  model: Item,
                  include: [
                      {
                          model: Tax,
                      },
                  ],
              },
          ],
          },
        ],
      });

      if (!invoice) {
        return next({ statusCode: 404, message: 'Invoice not found' });
      }

      return res.status(200).json(invoice);
    } catch (error) {
      logger.error(`Error retrieving invoice: ${error.message}`);
      next(error);
    }
  };

  // Update an invoice
 exports.updateInvoice = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const invoiceId = req.params.invoice_id;

    // Find the invoice by ID with existing items and taxes
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [
        {
          model: InvoiceItem,
          as: 'InvoiceItems',
          // include: [
          //   {
          //     model: InvoiceItemTax,
          //     as: 'InvoiceItemTaxes',
          //   },
          // ],
        },
      ],
      transaction,
    });

    if (!invoice) {
      await transaction.rollback();
      return next({ statusCode: 404, message: 'Invoice not found' });
    }

    // Update the invoice fields
    await invoice.update(req.body, { transaction });

    // Initialize invoice total
    let invoiceTotal = 0;

    // Handle invoice items
    if (req.body.invoice_items) {
      const invoiceItemsData = req.body.invoice_items;

      // Existing invoice item IDs
      const existingItemIds = invoice.InvoiceItems.map((item) => item.id);

      // Incoming invoice item IDs
      const incomingItemIds = invoiceItemsData
        .filter((item) => item.id)
        .map((item) => item.id);

      // Determine which items to delete
      const itemsToDelete = existingItemIds.filter(
        (id) => !incomingItemIds.includes(id)
      );

      // Delete removed invoice items and their taxes
      if (itemsToDelete.length > 0) {
        // await InvoiceItemTax.destroy({
        //   where: { invoice_item_id: itemsToDelete },
        //   transaction,
        // });

        await InvoiceItem.destroy({
          where: { id: itemsToDelete },
          transaction,
        });
      }

      // Process each invoice item
      for (const itemData of invoiceItemsData) {
        // Validate item existence
        const item = await Item.findOne({
          where: { id: itemData.item_id, store_id: invoice.store_id },
          transaction,
        });

        if (!item) {
          await transaction.rollback();
          return next({ statusCode: 404, message: `Item with ID ${itemData.item_id} not found` });
        }

        // Calculate totals
        const lineTotal = itemData.quantity * itemData.price;
        const discountAmount =
          itemData.discount_type === 'percentage'
            ? (lineTotal * itemData.discount_rate) / 100
            : itemData.discount_rate;
        const taxableAmount = lineTotal - discountAmount;

        // Calculate taxes
        let taxAmount = 0;
        let invoiceItemTaxes = [];

        if (itemData.taxes && itemData.taxes.length > 0) {
          for (const taxId of itemData.taxes) {
            const tax = await Tax.findOne({
              where: { id: taxId, store_id: invoice.store_id },
              transaction,
            });

            if (!tax) {
              await transaction.rollback();
              return next({ statusCode: 404, message: `Tax with ID ${taxId} not found` });
            }

            const taxLineAmount = (taxableAmount * tax.rate) / 100;
            taxAmount += taxLineAmount;

            invoiceItemTaxes.push({
              store_id: invoice.store_id,
              invoice_id: invoice.id,
              tax_id: tax.id,
              name: tax.name,
              amount: taxLineAmount,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        }

        const totalAmount = taxableAmount + taxAmount;
        invoiceTotal += totalAmount;

        let invoiceItem;

        if (itemData.id) {
          // Update existing invoice item
          invoiceItem = await InvoiceItem.findOne({
            where: { id: itemData.id },
            transaction,
          });

          if (invoiceItem) {
            await invoiceItem.update(
              {
                store_id: invoice.store_id,
                invoice_id: invoice.id,
                item_id: item.id,
                name: item.name,
                sku: item.sku,
                quantity: itemData.quantity,
                price: itemData.price,
                total: totalAmount,
                tax: taxAmount,
                discount_rate: itemData.discount_rate,
                discount_type: itemData.discount_type,
              },
              { transaction }
            );

            // Delete existing taxes for this invoice item
            // await InvoiceItemTax.destroy({
            //   where: { invoice_item_id: invoiceItem.id },
            //   transaction,
            // });
          } else {
            await transaction.rollback();
            return next({ statusCode: 404, message: `Invoice item with ID ${itemData.id} not found` });
          }
        } else {
          // Create new invoice item
          invoiceItem = await InvoiceItem.create(
            {
              store_id: invoice.store_id,
              invoice_id: invoice.id,
              item_id: item.id,
              name: item.name,
              sku: item.sku,
              quantity: itemData.quantity,
              price: itemData.price,
              total: totalAmount,
              tax: taxAmount,
              discount_rate: itemData.discount_rate,
              discount_type: itemData.discount_type,
              created_at: new Date(),
              updated_at: new Date(),
            },
            { transaction }
          );
        }

        // Create invoice item taxes
        // for (const taxData of invoiceItemTaxes) {
        //   await InvoiceItemTax.create(
        //     {
        //       ...taxData,
        //       invoice_item_id: invoiceItem.id,
        //     },
        //     { transaction }
        //   );
        // }
      }

      // Update invoice total amount
      await invoice.update({ amount: invoiceTotal }, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    // Reload the invoice with updated data
    const updatedInvoice = await Invoice.findByPk(invoiceId, {
      include: [
        {
          model: InvoiceItem,
          as: 'InvoiceItems',
          // include: [
          //   {
          //     model: InvoiceItemTax,
          //     as: 'InvoiceItemTaxes',
          //   },
          // ],
        },
      ],
    });

    return res.status(200).json(updatedInvoice);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error updating invoice: ${error.message}`);
    next(error);
  }
};
  // Delete an invoice (soft delete)
  exports.deleteInvoice = async (req, res, next) => {
    try {
      const invoiceId = req.params.invoice_id;

      // Find the invoice by ID
      const invoice = await Invoice.findByPk(invoiceId);

      if (!invoice) {
        return next({ statusCode: 404, message: 'Invoice not found' });
      }

      // Soft delete the invoice (if paranoid is enabled)
      await invoice.destroy();

      return res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting invoice: ${error.message}`);
      next(error);
    }
  };

  // NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
  exports.generateInvoicePDF = async (req, res, next) => {
    try {
      const { store_id, invoice_id } = req.params;
  
      // Fetch the invoice data
      const invoice = await Invoice.findOne({
        where: { id: invoice_id, store_id },
        include: [
          { model: InvoiceItem },
          { model: Contact, as: 'Contact' },
        ],
      });
  
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
  
      // Check if the user has access to this store
      const userStore = await UserStore.findOne({
        where: { user_id: req.user.id, store_id },
      });
  
      if (!userStore) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      // Create a PDF document
      const doc = new PDFDocument({ margin: 50 });
  
      // Set the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename=invoice_${invoice.invoice_number}.pdf`
      );
  
      // Pipe the PDF into the response
      doc.pipe(res);
  
      // Generate the PDF content
      const invoicePDF = await generatePDFContent(doc, invoice);
  
      res.send(invoicePDF);

      // Finalize the PDF and end the stream
      doc.end();

  


    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  
  // Function to generate the PDF content
  async function generatePDFContent(doc, invoice) {
    // Header
    doc
      .fontSize(20)
      .text('Invoice', { align: 'center' })
      .moveDown();
  
    // Invoice Details
    doc
      .fontSize(12)
      .text(`Invoice Number: ${invoice.invoice_number}`)
      .text(`Invoice Date: ${invoice.invoiced_at.toDateString()}`)
      .text(`Due Date: ${invoice.due_at.toDateString()}`)
      .moveDown();
  
    // Contact Details
    doc
      .fontSize(12)
      .text(`Bill To: ${invoice.contact_name}`)
      .text(`Email: ${invoice.contact_email}`)
      .text(`Phone: ${invoice.contact_phone}`)
      .moveDown();
  
    // Invoice Items Table
    doc.text('Items:', { underline: true });
    const tableTop = doc.y + 20;
  
    generateTable(doc, invoice.InvoiceItems, tableTop);
  
    // Total Amount
    doc
      .fontSize(12)
      .text(`Total Amount: ${invoice.amount} ${invoice.currency_code}`, {
        align: 'right',
      })
      .moveDown();
  
    // Notes and Footer
    if (invoice.notes) {
      doc.text(`Notes: ${invoice.notes}`).moveDown();
    }
  
    if (invoice.footer) {
      doc.text(invoice.footer, { align: 'center' }).moveDown();
    }
  }
  
  // Helper function to generate a table of items
  function generateTable(doc, items, y) {
    const itemX = 50;
    const quantityX = 300;
    const priceX = 350;
    const amountX = 450;
  
    // Table Header
    doc
      .fontSize(10)
      .text('Item', itemX, y, { bold: true })
      .text('Quantity', quantityX, y)
      .text('Price', priceX, y)
      .text('Amount', amountX, y);
  
    let position = y + 20;
  
    items.forEach((item) => {
      const amount = item.quantity * item.price;
  
      doc
        .fontSize(10)
        .text(item.name, itemX, position)
        .text(item.quantity, quantityX, position)
        .text(item.price.toFixed(2), priceX, position)
        .text(amount.toFixed(2), amountX, position);
  
      position += 20;
    });
  }

  exports.getInvoicePDF = async (req, res, next) => {
    try {
      console.log("getInvoicePDF")
      const { store_id, invoice_id } = req.params;
  
      // Check if the user has access to this store
      const userStore = await UserStore.findOne({
        where: { user_id: req.user.id, store_id },
      });
  
      if (!userStore) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      // Fetch the invoice
      const invoice = await Invoice.findOne({
        where: { id: invoice_id, store_id },
      });
  
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
  
      // Fetch the associated media
      const media = await invoice.getMedia({
        through: {
          where: {
            mediable_type: 'Invoice',
            tag: 'invoice_pdf',
          },
        },
      });

      console.log(media)
  
      if (!media || media.length === 0) {
        return res.status(404).json({ error: 'Invoice PDF not found' });
      }
  
      const pdfMedia = media[0]; // Assuming only one PDF per invoice
  
      const filePath = pdfMedia.path;
  
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'PDF file not found' });
      }
  
      // Set headers
      res.setHeader('Content-Type', pdfMedia.mime_type);
      res.setHeader('Content-Disposition', `inline; filename=${pdfMedia.filename}`);
  
      // Stream the PDF file
      const fileStream = fs.createReadStream(filePath);

      // Handle stream errors
      fileStream.on('error', (streamErr) => {
          console.error('Stream Error:', streamErr);
          return res.status(500).json({ error: 'Error reading PDF file' });
      });

      fileStream.pipe(res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  // Get Invoice Summary across all stores
exports.getInvoiceSummary = async (req, res, next) => {
  try {
    const storeIds = req.user.stores // Assuming req.user.stores contains associated store IDs

    // Total Invoices
    const totalInvoices = await Invoice.count({
      where: { store_id: { [Op.in]: storeIds } },
    });

    // Total Revenue
    const totalRevenueResult = await Invoice.findAll({
      where: { store_id: { [Op.in]: storeIds }, status: { [Op.ne]: 'draft' } }, // Exclude draft invoices if needed
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue']],
      raw: true,
    });
    const totalRevenue = parseFloat(totalRevenueResult[0].totalRevenue) || 0;

    // Total Unique Customers
    const uniqueCustomers = await Contact.count({
      where: {
        id: {
          [Op.in]: sequelize.literal(`(SELECT DISTINCT contact_id FROM Invoices WHERE store_id IN (${storeIds.join(',')}))`),
        },
      },
    });

    return res.status(200).json({
      totalInvoices,
      totalRevenue,
      totalCustomers: uniqueCustomers,
    });
  } catch (error) {
    logger.error(`Error fetching invoice summary: ${error.message}`);
    console.log(error)
    next(error);
  }
};

// Get Recent Invoices across all stores
exports.getRecentInvoices = async (req, res, next) => {
  try {
    const storeIds = req.user.stores

    const recentInvoices = await Invoice.findAll({
      where: { store_id: { [Op.in]: storeIds } },
      include: [
        { model: Contact, attributes: ['id', 'name', 'email'] },
        { model: Store, attributes: ['id', 'store_name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return res.status(200).json(recentInvoices);
  } catch (error) {
    logger.error(`Error fetching recent invoices: ${error.message}`);
    next(error);
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Generate the invoice PDF
    const pdfPath = await generateInvoicePDFHelper(invoiceId);

    // Send the generated PDF file as a response
    res.download(pdfPath, (err) => {
      if (err) {
        logger.error('Error sending the invoice PDF:', err);
        res.status(500).send('Error sending the invoice PDF');
      }
    });
  } catch (error) {
    logger.error('Error generating the invoice:', error);
    res.status(500).send('Error generating the invoice');
  }
};