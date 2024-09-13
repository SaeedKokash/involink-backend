const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');

// CRUD operations for Stores
router.post('/', taxController.createTax);
router.get('/', taxController.getTaxesByStore);
router.get('/:id', taxController.getTaxById);
router.put('/:id', taxController.updateTax);
router.delete('/:id', taxController.deleteTax);

module.exports = router;
