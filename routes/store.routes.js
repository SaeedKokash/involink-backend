const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const { checkRole, checkPermission } = require('../middlewares/authMiddleware');

const upload = multer();

const {
  createStore,
  getStoresByUser,
  getStoreById,
  updateStore,
  deleteStore,
  restoreStore,
  addUserToStoreAsEmployee
} = require("../controllers/storeController");

const { authorizeStoreAccess } = require("../middlewares/authorization");

const {
  getInvoiceSummary,
  getRecentInvoices,
} = require("../controllers/invoiceController");

const { validateCreateStore, validateUpdateStore } = require("../validators/storeValidator");

// CRUD operations for Stores
router.post("/", upload.single('logo'), validateCreateStore, createStore);

router.get("/", getStoresByUser);

router.get("/:store_id", authorizeStoreAccess, getStoreById);

router.put("/:store_id", upload.single('logo'), validateUpdateStore, authorizeStoreAccess, checkPermission('update_store'), updateStore);

router.delete("/:store_id", authorizeStoreAccess, deleteStore);
   
router.post("/:store_id/restore", authorizeStoreAccess, restoreStore);

// needs alot of work by adding roles and permissions correctly.
router.post('/:storeId/users/:userId/employee', addUserToStoreAsEmployee);


// CRUD operations for Invoices
router.get("/summary", getInvoiceSummary);
router.get("/recent", getRecentInvoices);

module.exports = router;
