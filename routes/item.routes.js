const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// CRUD operations for Items
router.post('/', itemController.createItem);
router.get('/:id', itemController.getItemById);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

router.get('/store/:id', itemController.getItemsByStore);

module.exports = router;
