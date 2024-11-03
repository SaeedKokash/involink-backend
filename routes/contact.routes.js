const express = require('express');
const router = express.Router({ mergeParams: true });

const { createContact, getContactsByStore, getContactById, updateContact, deleteContact } = require('../controllers/contactController');
const { validateContact } = require('../validators/contactValidator');
const { authorizeContactAccess } = require('../middlewares/authorization');

// Apply authorizeContactAccess middleware to routes with :contact_id
router.use('/:contact_id', authorizeContactAccess);

// CRUD operations for Stores
router.post('/', validateContact, createContact);
router.get('/', getContactsByStore);
router.get('/:contact_id', getContactById);
router.put('/:contact_id', validateContact, updateContact);
router.delete('/:contact_id', deleteContact);

module.exports = router;
