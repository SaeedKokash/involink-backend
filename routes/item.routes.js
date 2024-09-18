const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// CRUD operations for Items
router.post('/', itemController.createItem);
router.get('/:item_id', itemController.getItemById);
router.put('/:item_id', itemController.updateItem);
router.delete('/:item_id', itemController.deleteItem);

router.get('/store/:store_id', itemController.getItemsByStore);

module.exports = router;
