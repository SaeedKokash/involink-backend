const express = require('express');
const router = express.Router();
const rtpController = require('../controllers/rtpController');

// CRUD operations for Payments
router.post('/', rtpController.createRequestToPay);
router.get('/', rtpController.getRequestToPayByInvoice);
router.get('/:id', rtpController.getRequestToPayById);
router.put('/:id', rtpController.updateRequestToPay);
router.delete('/:id', rtpController.deleteRequestToPay);

module.exports = router;
