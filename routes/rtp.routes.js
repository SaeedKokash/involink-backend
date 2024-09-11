const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/rtpController');

// CRUD operations for Payments
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePaymentStatus);
router.delete('/:id', paymentController.deletePayment);

router.get('/rtp', paymentController.getRTPData)
module.exports = router;
