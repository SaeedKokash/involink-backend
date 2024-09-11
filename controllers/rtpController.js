'use strict';

const { Payment } = require('../models');

exports.getRTPData = async (req, res, next) => {
  try {
    const rtpData = await RequestToPay.findAll();

    res.status(200).json({ rtpData });
  } catch (error) {
    logger.error(`Error fetching RTP data: ${error.message}`);
    next(error);
  }
}

exports.createPayment = async (req, res) => {
  try {
    const { name, address, paymentAddress, userId } = req.body;
    const newPayment = await Payment.create({ name, address, paymentAddress, userId });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, paymentAddress } = req.body;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    await payment.update({ name, address, paymentAddress });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    await payment.destroy();
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};
