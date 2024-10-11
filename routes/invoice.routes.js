const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { validateInvoice } = require('../validators/invoiceValidator');
const { authorizeStoreAccess, authorizeInvoiceAccess } = require('../middlewares/authorization');

// CRUD operations for Invoices
router.post('/', authorizeStoreAccess, validateInvoice, invoiceController.createInvoice);
router.get('/:invoice_id', authorizeInvoiceAccess, invoiceController.getInvoiceById);
router.put('/:invoice_id', authorizeInvoiceAccess, validateInvoice, invoiceController.updateInvoice);
router.delete('/:invoice_id', authorizeInvoiceAccess, invoiceController.deleteInvoice);

router.get('/store/:store_id', authorizeStoreAccess, invoiceController.getInvoicesByStore);

// PDF generation route
router.get('/store/:store_id/invoices/:invoice_id/pdf', invoiceController.getInvoicePDF);


module.exports = router;