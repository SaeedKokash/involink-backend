const { Store, User, Tax, Invoice, Item, Bill, Contact, Account, ModuleHistory } = require('../models'); 

// Create a new store
exports.createStore = async (req, res) => {
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
    await newStore.addUser(userId);

    return res.status(201).json(newStore);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create store' });
  }
};

// Get all stores for a user
exports.getStoresByUser = async (req, res) => {
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

// Get a single store by ID, including associated data
exports.getStoreById = async (req, res) => {
  try {
    const storeId = req.params.store_id;

    // Fetch the store by ID, including related data like users, taxes, items, etc.
    const store = await Store.findByPk(storeId, {
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Tax, attributes: ['name', 'rate'] },
        { model: Invoice },
        { model: Item },
        { model: Bill },
        { model: Contact },
        { model: Account },
        { model: ModuleHistory },
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
exports.updateStore = async (req, res) => {
  try {
    const storeId = req.params.store_id;

    // Find the store by ID
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
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
exports.deleteStore = async (req, res) => {
  try {
    const storeId = req.params.store_id;

    // Find the store by ID
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Soft delete the store (if paranoid is enabled)
    await store.destroy();

    return res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete store' });
  }
};
