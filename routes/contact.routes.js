const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// CRUD operations for Stores
router.post('/', contactController.createContact);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

router.get('/store/:id', contactController.getContactsByStore);

module.exports = router;
