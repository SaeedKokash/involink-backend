const { Store, UserStore, User, Tax, Invoice, Item, Contact, Account } = require('../models'); 
const logger = require('../config/logger');

// Create a new store
exports.createStore = async (req, res, next) => {
  try {
    const { store_name, address, enabled } = req.body;
    const userId = req.user.id;  // Assuming the authenticated user is creating the store

    // Create the store and associate it with the authenticated user
    const newStore = await Store.create({
      store_name,
      address,
      enabled,
    });

    // Associate the store with the user (through UserStore)
    await UserStore.create({
      user_id: userId,
      store_id: newStore.id,
      user_type: 'User',
    });

    return res.status(201).json(newStore);
  } catch (error) {
    logger.error(`Error creating store: ${error.message}`);
    next(error);
  }
};

// Get all stores for a user
exports.getStoresByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Retrieve all stores associated with the user
    const stores = await Store.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          attributes: ['name', 'email'], // Optionally include user details
        },
      ],
    });

    return res.status(200).json(stores);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve stores' });
  }
};

// // Get all stores
// exports.getAllStores = async (req, res, next) => {
//   try {
//     // Retrieve all stores
//     const stores = await Store.findAll();

//     return res.status(200).json(stores);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Failed to retrieve stores' });
//   }
// };

// Get a single store by ID, including associated data
exports.getStoreById = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;

    // Fetch the store by ID, including related data like users, taxes, items, etc.
    const store = await Store.findByPk(storeId, {
      include: [
        { model: User,
          attributes: ['name', 'email'],
          through: { attributes: [] }, // This prevents the UserStore data from being included
        },
        { model: Tax, attributes: ['name', 'rate'] },
        { model: Invoice },
        { model: Item },
        { model: Contact },
        { model: Account },
        // { model: Bill },
        // { model: ModuleHistory },
      ],
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.status(200).json(store);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve store' });
  }
};

// Update a store
exports.updateStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;

    // Find the store by ID and populate the users field
    const store = await Store.findByPk(storeId, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] }, // This prevents the UserStore data from being included
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // check if the user is authorized to update the store (only the store owner can update the store)
    if (store.Users[0].id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this store' });
    }
    // Update the store
    const updatedStore = await store.update(req.body);

    return res.status(200).json(updatedStore);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update store' });
  }
};

// Delete a store (soft delete)
exports.deleteStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;

    // Find the store by ID
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (store.Users[0].id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this store' });
    }

    // Soft delete the store (if paranoid is enabled)
    await store.destroy();

    return res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete store' });
  }
};

// Restore a deleted store
exports.restoreStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;

    // Restore the store
    const store = await Store.restore({ where: { id: storeId } });

    if (store.Users[0].id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to restore this store' });
    }

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.status(200).json({ message: 'Store restored successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to restore store' });
  }
};

