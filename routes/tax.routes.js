const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');

// CRUD operations for Stores
router.post('/', taxController.createTax);
router.get('/store/:store_id', taxController.getTaxesByStore);
router.get('/:tax_id', taxController.getTaxById);
router.put('/:tax_id', taxController.updateTax);
router.delete('/:tax_id', taxController.deleteTax);

module.exports = router;
