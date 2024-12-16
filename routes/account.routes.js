const express = require('express');
const router = express.Router({ mergeParams: true });

const { createAccount, getAccountsByStore, getAccountById, updateAccount, deleteAccount, restoreAccount } = require('../controllers/accountController');
const { validateAccount } = require('../validators/accountValidator');
const { authorizeAccountAccess } = require('../middlewares/authorization');

// Apply authorizeAccountAccess middleware to routes with :account_id
router.use('/:account_id', authorizeAccountAccess);

// CRUD operations for Accounts
router.post('/', validateAccount, createAccount);

router.get('/', getAccountsByStore);
router.get('/:account_id', getAccountById);
router.put('/:account_id', validateAccount, updateAccount);
router.delete('/:account_id', deleteAccount);
router.post('/:account_id/restore', restoreAccount);


module.exports = router;