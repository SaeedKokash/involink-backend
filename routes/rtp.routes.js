const express = require('express');
const router = express.Router();
const rtpController = require('../controllers/rtpController');

// CRUD operations for Payments
router.post('/', rtpController.createRequestToPay);
router.get('/:rtp_id', rtpController.getRequestToPayById);
router.put('/:rtp_id', rtpController.updateRequestToPay);
router.delete('/:rtp_id', rtpController.deleteRequestToPay);

router.get('/invoice/:invoice_id', rtpController.getRequestToPayByInvoice);

module.exports = router;
