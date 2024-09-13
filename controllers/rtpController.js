const { RequestToPay, Invoice, 
  // Session 
} = require('../models'); // Import necessary models

// Create a new RequestToPay
exports.createRequestToPay = async (req, res) => {
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
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Check if the session exists
    // const session = await Session.findByPk(session_id);
    // if (!session) {
    //   return res.status(404).json({ error: 'Session not found' });
    // }

    // Create the RequestToPay
    const newRequest = await RequestToPay.create({
      invoice_id,
      session_id,
      msgId,
      purpose,
      amount,
      receiverType,
      senderType,
      extraData,
    });

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create RequestToPay' });
  }
};

// Get all RequestToPay entries for an invoice
exports.getRequestToPayByInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.invoice_id;

    // Check if the invoice exists
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // // Retrieve all RequestToPay entries for the invoice
    // const requests = await RequestToPay.findAll({
    //   where: { invoice_id: invoiceId },
    //   include: [{ model: Session }],
    // });

    return res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve RequestToPay entries' });
  }
};

// Get a single RequestToPay by ID
exports.getRequestToPayById = async (req, res) => {
  try {
    const requestId = req.params.rtp_id;

    // // Fetch the RequestToPay by ID, including session information
    // const request = await RequestToPay.findByPk(requestId, {
    //   include: [{ model: Session }],
    // });

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
exports.updateRequestToPay = async (req, res) => {
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
exports.deleteRequestToPay = async (req, res) => {
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
