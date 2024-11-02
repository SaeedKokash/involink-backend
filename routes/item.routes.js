const express = require('express');
const router = express.Router({ mergeParams: true });

const { createItem, getItemsByStore, getItemById, updateItem, deleteItem } = require('../controllers/itemController');
const { validateItem } = require('../validators/itemValidator');
const { authorizeItemAccess } = require('../middlewares/authorization');

// Apply authorizeItemAccess middleware to routes with :item_id
router.use('/:item_id', authorizeItemAccess);

// CRUD operations for Items
router.post('/', validateItem, createItem);
router.get('/', getItemsByStore);
router.get('/:item_id', getItemById);
router.put('/:item_id', validateItem, updateItem);
router.delete('/:item_id', deleteItem);

module.exports = router;
