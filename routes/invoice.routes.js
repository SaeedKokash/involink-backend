const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// CRUD operations for Invoices
router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id', invoiceController.updateInvoiceStatus);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
