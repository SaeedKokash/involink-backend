const { sequelize, RequestToPay, Invoice, UserStore, Transaction, InvoiceHistory, Account
  // Session 
} = require('../models'); // Import necessary models
const logger = require('../config/logger');

// Create a new RequestToPay
// exports.createRequestToPay = async (req, res, next) => {
//   try {
//     const {
//       invoice_id,
//       session_id,
//       msgId,
//       purpose,
//       amount,
//       receiverType,
//       senderType,
//       extraData, // Assuming this is a JSON field
//     } = req.body;

//     // Check if the invoice exists
//     const invoice = await Invoice.findByPk(invoice_id);
//     if (!invoice) {
//       next({ statusCode: 404, message: 'Invoice not found' });
//     }

//     // Check if user has access to the store
//     const userStore = await UserStore.findOne({
//       where: { user_id: req.user.id, store_id: invoice.store_id },
//     });

//     if (!userStore) {
//       next({ statusCode: 403, message: 'You are not authorized to access this resource' });
//     }

//     // get the account_id from the store
//     const account = await Account.findOne({
//       where: { store_id: invoice.store_id },
//     });     

//     if (!account) {
//       next({ statusCode: 404, message: 'Account not found' });
//     }

//     // Create the RequestToPay
//     const rtp = await RequestToPay.create({
//       invoice_id,
//       session_id,
//       msgId,
//       purpose,
//       amount,
//       receiverType,
//       senderType,
//       extraData,
//       status: 'pending',
//     });



//     // Simulate sending RTP (mock)
//     setTimeout(async () => {
//       // start a transaction
//       const t = await sequelize.transaction();

//       try {
  
//       // Simulate RTP processing
//       rtp.status = 'completed';
//       await rtp.save({ transaction: t });

//       // Update invoice status
//       invoice.status = 'paid';
//       await invoice.save({ transaction: t });

//       // Record transaction (simplified)
//       await Transaction.create({
//         store_id: invoice.store_id,
//         type: 'payment',
//         paid_at: new Date(),
//         amount: rtp.amount,
//         currency_code: invoice.currency_code,
//         account_id: account.id,
//         document_id: invoice.id,
//         contact_id: invoice.contact_id,
//         description: 'Payment received via RTP.',
//       }, { transaction: t });

//       // Add to invoice histories
//       await InvoiceHistory.create({
//         store_id: invoice.store_id,
//         invoice_id: invoice.id,
//         status: 'paid',
//         notify: true,
//         description: 'Invoice marked as paid via RTP.',
//       }, { transaction: t });

//       logger.info(`RequestToPay ${rtp.id} processed successfully`);

//       // Commit the transaction
//       await t.commit();

//       // e.g. send email to customer
//       // await sendPaymentConfirmationEmail(invoice);
//       }
//       catch (error) {
//         // Rollback the transaction if an error occurs
//         await t.rollback();
//         logger.error(`Error Simulating RTP: ${error.message}`);
//         next(error);
//       }
//     }, 5000); // Simulate 5 seconds processing time

//     return res.status(201).json(rtp);
//   } catch (error) {
//     logger.error(`Error creating RequestToPay: ${error.message}`);
//     next(error);
//   }
// };

exports.createRequestToPay = async (req, res, next) => {
  try {
    const {
      invoice_id,
      session_id,
      msgId,
      purpose,
      amount,
      receiverType,
      senderType,
      extraData, // Assuming this is a JSON field
    } = req.body;

    // Check if the invoice exists
    const invoice = await Invoice.findByPk(invoice_id);
    if (!invoice) {
      return next({ statusCode: 404, message: 'Invoice not found' });
    }

    // Check if user has access to the store
    const userStore = await UserStore.findOne({
      where: { user_id: req.user.id, store_id: invoice.store_id },
    });

    if (!userStore) {
      return next({ statusCode: 403, message: 'You are not authorized to access this resource' });
    }

    // Get the account_id from the store
    const account = await Account.findOne({
      where: { store_id: invoice.store_id },
    });

    if (!account) {
      return next({ statusCode: 404, message: 'Account not found' });
    }

    // Create the RequestToPay
    const rtp = await RequestToPay.create({
      invoice_id,
      session_id,
      msgId,
      purpose,
      amount,
      receiverType,
      senderType,
      extraData,
      status: 'pending',
    });

    // Simulate sending RTP (mock)
    setTimeout(async () => {
      // Start a transaction
      const t = await sequelize.transaction();

      try {
        // Simulate RTP processing
        rtp.status = 'completed';
        await rtp.save({ transaction: t });

        // Update invoice status
        invoice.status = 'paid';
        await invoice.save({ transaction: t });

        // Record transaction (simplified)
        await Transaction.create(
          {
            store_id: invoice.store_id,
            type: 'payment',
            paid_at: new Date(),
            amount: rtp.amount,
            currency_code: invoice.currency_code,
            account_id: account.id,
            document_id: invoice.id,
            contact_id: invoice.contact_id,
            description: 'Payment received via RTP.',
          },
          { transaction: t }
        );

        // Add to invoice histories
        await InvoiceHistory.create(
          {
            store_id: invoice.store_id,
            invoice_id: invoice.id,
            status: 'paid',
            notify: true,
            description: 'Invoice marked as paid via RTP.',
          },
          { transaction: t }
        );

        logger.info(`RequestToPay ${rtp.id} processed successfully`);

        // Commit the transaction
        await t.commit();
      } catch (error) {
        // Rollback the transaction if an error occurs
        await t.rollback();
        logger.error(`Error Simulating RTP: ${error.message}`);
        // Optionally, emit an event or notify about the error
      }
    }, 5000); // Simulate 5 seconds processing time

    return res.status(201).json(rtp);
  } catch (error) {
    logger.error(`Error creating RequestToPay: ${error.message}`);
    return next(error);
  }
};

// Get all RequestToPay entries for an invoice
exports.getRequestToPayByInvoice = async (req, res, next) => {
  try {
    const invoiceId = req.params.invoice_id;
console.log(invoiceId);
    // Check if the invoice exists
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Retrieve all RequestToPay entries for the invoice
    const requests = await RequestToPay.findAll({
      where: { invoice_id: invoiceId },
      // include: [{ model: Session }],
    });

    console.log(requests);
    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to retrieve RequestToPay entries' });
  }
};

// Get a single RequestToPay by ID
exports.getRequestToPayById = async (req, res, next) => {
  try {
    const requestId = req.params.rtp_id;

    // Fetch the RequestToPay by ID, including session information
    const request = await RequestToPay.findByPk(requestId, {
      // include: [{ model: Session }],
    });

    if (!request) {
      return res.status(404).json({ error: 'RequestToPay entry not found' });
    }

    return res.status(200).json(request);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve RequestToPay entry' });
  }
};

// Update a RequestToPay
exports.updateRequestToPay = async (req, res, next) => {
  try {
    const requestId = req.params.rtp_id;

    // Find the RequestToPay entry by ID
    const request = await RequestToPay.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ error: 'RequestToPay entry not found' });
    }

    // Update the RequestToPay entry
    const updatedRequest = await request.update(req.body);

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update RequestToPay entry' });
  }
};

// Delete a RequestToPay (soft delete)
exports.deleteRequestToPay = async (req, res, next) => {
  try {
    const requestId = req.params.rtp_id;

    // Find the RequestToPay entry by ID
    const request = await RequestToPay.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ error: 'RequestToPay entry not found' });
    }

    // Soft delete the RequestToPay entry (if paranoid is enabled)
    await request.destroy();

    return res.status(200).json({ message: 'RequestToPay entry deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete RequestToPay entry' });
  }
};
