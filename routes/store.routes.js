const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// CRUD operations for Stores
router.post('/', storeController.createStore);
router.get('/', storeController.getStoresByUser);
router.get('/:id', storeController.getStoreById);
router.put('/:id', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;
