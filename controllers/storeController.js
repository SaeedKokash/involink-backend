const { Store } = require('../models');

exports.createStore = async (req, res) => {
  try {
    const { name, address, paymentAddress, userId } = req.body;
    const newStore = await Store.create({ name, address, paymentAddress, userId });
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create store' });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, paymentAddress } = req.body;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    await store.update({ name, address, paymentAddress });
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update store' });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    await store.destroy();
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete store' });
  }
};
