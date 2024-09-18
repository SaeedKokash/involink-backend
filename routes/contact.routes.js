const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// CRUD operations for Stores
router.post('/', contactController.createContact);
router.get('/:contact_id', contactController.getContactById);
router.put('/:contact_id', contactController.updateContact);
router.delete('/:contact_id', contactController.deleteContact);

router.get('/store/:store_id', contactController.getContactsByStore);

module.exports = router;
