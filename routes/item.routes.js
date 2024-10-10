const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

const { validateItem } = require('../validators/itemValidator');
const { authorizeStoreAccess, authorizeItemAccess } = require('../middlewares/authorization');


// CRUD operations for Items
router.post('/', authorizeStoreAccess, validateItem, itemController.createItem);
router.get('/:item_id', authorizeItemAccess, itemController.getItemById);
router.put('/:item_id', authorizeItemAccess,validateItem, itemController.updateItem);
router.delete('/:item_id', authorizeItemAccess, itemController.deleteItem);

router.get('/store/:store_id',authorizeStoreAccess, itemController.getItemsByStore);

module.exports = router;
