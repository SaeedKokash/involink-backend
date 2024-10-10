const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { validateAccount } = require('../validators/accountValidator');
const { authorizeStoreAccess, authorizeAccountAccess } = require('../middlewares/authorization');

// CRUD operations for Accounts
router.post('/', authorizeStoreAccess, validateAccount, accountController.createAccount);
router.get('/:account_id', authorizeAccountAccess, accountController.getAccountById);
router.put('/:account_id', authorizeAccountAccess, validateAccount, accountController.updateAccount);
router.delete('/:account_id', authorizeAccountAccess, accountController.deleteAccount);

router.get('/store/:store_id', authorizeStoreAccess, accountController.getAccountsByStore);

module.exports = router;