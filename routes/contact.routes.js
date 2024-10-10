const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContact } = require('../validators/contactValidator');
const { authorizeStoreAccess, authorizeContactAccess } = require('../middlewares/authorization');


// CRUD operations for Stores
router.post('/', authorizeStoreAccess, validateContact, contactController.createContact);
router.get('/:contact_id', authorizeContactAccess, contactController.getContactById);
router.put('/:contact_id', authorizeContactAccess, validateContact, contactController.updateContact);
router.delete('/:contact_id', authorizeContactAccess, contactController.deleteContact);

router.get('/store/:store_id', authorizeStoreAccess, contactController.getContactsByStore);

module.exports = router;
