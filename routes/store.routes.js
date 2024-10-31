const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');

const { authorizeStoreAccess } = require('../middlewares/authorization');


// CRUD operations for Stores
router.post('/', storeController.createStore);

router.get('/', storeController.getStoresByUser);

router.get('/:store_id', authorizeStoreAccess, storeController.getStoreById);

router.put('/:store_id', authorizeStoreAccess, storeController.updateStore);

router.delete('/:store_id', authorizeStoreAccess, storeController.deleteStore);

router.post('/:store_id', authorizeStoreAccess, storeController.restoreStore);


module.exports = router;
