const express = require('express');
const router = express.Router({ mergeParams: true });
const { createRequestToPay, getRequestToPayByInvoice, getRequestToPayById, updateRequestToPay, deleteRequestToPay } = require('../controllers/rtpController');

const { authorizeRTPAccess } = require('../middlewares/authorization');

// Apply authorizeRTPAccess middleware to routes with :rtp_id
// router.use('/:rtp_id', authorizeRTPAccess);

// CRUD operations for Payments
router.post('/', createRequestToPay);
router.get('/:rtp_id', getRequestToPayById);
router.put('/:rtp_id', updateRequestToPay);
router.delete('/:rtp_id', deleteRequestToPay);

router.get('/invoice/:invoice_id', getRequestToPayByInvoice);

module.exports = router;
