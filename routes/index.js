'use strict';

const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const storeRoutes = require("./store.routes");
const itemRoutes = require("./item.routes");
const invoiceRoutes = require("./invoice.routes");
const rtpRoutes = require("./rtp.routes");
const accountRoutes = require("./account.routes");
const contactRoutes = require("./contact.routes");
const taxRoutes = require("./tax.routes");

const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeStoreAccess } = require('../middlewares/authorization');

router.use("/auth", authRoutes);
router.use("/users", authenticate, userRoutes);

router.use("/stores", authenticate, storeRoutes);
router.use('/stores/:store_id/items', authenticate, authorizeStoreAccess, itemRoutes);
router.use('/stores/:store_id/accounts', authenticate, authorizeStoreAccess, accountRoutes);
router.use('/stores/:store_id/contacts', authenticate, authorizeStoreAccess, contactRoutes);

router.use('/stores/:store_id/invoices', authenticate, authorizeStoreAccess, invoiceRoutes);
router.use('/stores/:store_id/rtps', authenticate, authorizeStoreAccess, rtpRoutes);
router.use('/stores/:store_id/taxes', authenticate, authorizeStoreAccess, taxRoutes);

module.exports = router;