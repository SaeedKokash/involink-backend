const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// CRUD operations for Invoices
router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getInvoicesByStore);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
