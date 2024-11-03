const express = require('express');
const router = express.Router({ mergeParams: true });
const { createInvoice, getInvoicesByStore, getInvoiceById, updateInvoice, deleteInvoice, generateInvoicePDF, getInvoicePDF, getInvoiceSummary, getRecentInvoices } = require('../controllers/invoiceController');
const { validateInvoice } = require('../validators/invoiceValidator');
const { authorizeInvoiceAccess } = require('../middlewares/authorization');

// Apply authorizeInvoiceAccess middleware to routes with :invoice_id
router.use('/:invoice_id', authorizeInvoiceAccess);

// CRUD operations for Invoices
router.get('/summary', getInvoiceSummary);
router.get('/recent', getRecentInvoices);

router.post('/', validateInvoice, createInvoice);
router.get('/', getInvoicesByStore);
router.get('/:invoice_id', getInvoiceById);
router.put('/:invoice_id', validateInvoice, updateInvoice);
router.delete('/:invoice_id', deleteInvoice);

// PDF generation route
router.get('/:invoice_id/pdf', getInvoicePDF);

module.exports = router;