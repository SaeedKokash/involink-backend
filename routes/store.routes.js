const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// CRUD operations for Stores
router.post('/', storeController.createStore);
router.get('/', storeController.getStoresByUser);
router.get('/:store_id', storeController.getStoreById);
router.put('/:store_id', storeController.updateStore);
router.delete('/:store_id', storeController.deleteStore);
router.post('/:store_id', storeController.restoreStore);

module.exports = router;
