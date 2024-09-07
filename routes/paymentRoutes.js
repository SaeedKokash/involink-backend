const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// CRUD operations for Payments
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePaymentStatus);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
