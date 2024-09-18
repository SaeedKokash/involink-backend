const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// CRUD operations for Invoices
router.post('/', invoiceController.createInvoice);
router.get('/:invoice_id', invoiceController.getInvoiceById);
router.put('/:invoice_id', invoiceController.updateInvoice);
router.delete('/:invoice_id', invoiceController.deleteInvoice);

router.get('/store/:store_id', invoiceController.getInvoicesByStore);

module.exports = router;
