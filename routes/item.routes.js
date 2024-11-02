const express = require('express');
const router = express.Router({ mergeParams: true });
// const itemRoutes = express.Router({ mergeParams: true });
const itemController = require('../controllers/itemController');

const { validateItem } = require('../validators/itemValidator');
const { authorizeStoreAccess, authorizeItemAccess } = require('../middlewares/authorization');


// CRUD operations for Items
router.post('/', validateItem, itemController.createItem);

router.get('/', itemController.getItemsByStore);

router.get('/:item_id', itemController.getItemById);

router.put('/:item_id', validateItem, itemController.updateItem);

router.delete('/:item_id', itemController.deleteItem);


module.exports = router;
