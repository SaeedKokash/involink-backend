const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const { validateTax } = require('../validators/taxValidator');
const { authorizeStoreAccess, authorizeTaxAccess } = require('../middlewares/authorization');

// CRUD operations for Taxes
router.post('/', authorizeStoreAccess, validateTax, taxController.createTax);
router.get('/:tax_id', authorizeTaxAccess, taxController.getTaxById);
router.put('/:tax_id', authorizeTaxAccess, validateTax, taxController.updateTax);
router.delete('/:tax_id', authorizeTaxAccess, taxController.deleteTax);

router.get('/store/:store_id', authorizeStoreAccess, taxController.getTaxesByStore);

module.exports = router;