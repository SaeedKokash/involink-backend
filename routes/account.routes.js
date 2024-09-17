const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// CRUD operations for Stores
router.post('/', accountController.createAccount);
router.get('/:account_id', accountController.getAccountById);
router.put('/:account_id', accountController.updateAccount);
router.delete('/:account_id', accountController.deleteAccount);

router.get('/store/:store_id', accountController.getAccountsByStore);

module.exports = router;
