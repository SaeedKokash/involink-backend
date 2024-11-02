const express = require('express');
const router = express.Router({ mergeParams: true });

const { createTax, getTaxesByStore, getTaxById, updateTax, deleteTax } = require('../controllers/taxController');
const { validateTax } = require('../validators/taxValidator');
const { authorizeTaxAccess } = require('../middlewares/authorization');

// Apply authorizeTaxAccess middleware to routes with :tax_id
router.use('/:tax_id', authorizeTaxAccess);

// CRUD operations for Taxes
router.post('/', validateTax, createTax);
router.get('/', getTaxesByStore);
router.get('/:tax_id', getTaxById);
router.put('/:tax_id', validateTax, updateTax);
router.delete('/:tax_id', deleteTax);


module.exports = router;