// middlewares/authorization.js
const { UserStore, Item, Contact, Account, Tax, Invoice, RequestToPay } = require('../models');

/**
 * Middleware to authorize access to a specific store.
 */
exports.authorizeStoreAccess = async (req, res, next) => {
  try {
    const user = req.user;
    const storeId = req.params.store_id;

    if (!storeId) {
      return res.status(400).json({ error: 'Store ID is required' });
    }

    const userStore = await UserStore.findOne({
      where: { user_id: user.id, store_id: storeId },
    });

    if (!userStore) {
      return res.status(403).json({ error: 'You do not have access to this store.' });
    }

    req.userStore = userStore;

    next();
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Higher-order function to create authorization middleware for different resources.
 * @param {Object} model - The Sequelize model to query.
 * @param {String} paramName - The name of the route parameter containing the resource ID.
 * @param {String} resourceName - The human-readable name of the resource (for error messages).
 * @returns {Function} - Express middleware function.
 */
const authorizeResourceAccess = (model, paramName, resourceName) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const storeId = req.params.store_id;


      if (!resourceId) {
        return res.status(400).json({ error: `${resourceName} ID is required` });
      }

      const resource = await model.findByPk(resourceId);
      if (!resource) {
        return res.status(404).json({ error: `${resourceName} not found` });
      }
      
      if (resource.store_id !== parseInt(storeId)) {
        return res.status(400).json({ error: `${resourceName} does not belong to the specified store` });
      }

      next();
    } catch (error) {
      console.error('Authorization Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Export specific authorization middleware using the generic function
exports.authorizeItemAccess = authorizeResourceAccess(Item, 'item_id', 'Item');
exports.authorizeContactAccess = authorizeResourceAccess(Contact, 'contact_id', 'Contact');
exports.authorizeAccountAccess = authorizeResourceAccess(Account, 'account_id', 'Account');
exports.authorizeTaxAccess = authorizeResourceAccess(Tax, 'tax_id', 'Tax');
exports.authorizeInvoiceAccess = authorizeResourceAccess(Invoice, 'invoice_id', 'Invoice');
exports.authorizeRTPAccess = authorizeResourceAccess(RequestToPay, 'rtp_id', 'Request To Pay');