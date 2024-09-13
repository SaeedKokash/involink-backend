const { Account, Store } = require('../models'); // Assuming your models are in a folder called models

// Create a new account
exports.createAccount = async (req, res) => {
  try {
    const { name, number, currency_code, opening_balance, bank_name, bank_phone, bank_address, enabled } = req.body;

    const storeId = req.body.store_id || req.params.store_id;  // Make sure the store ID is provided

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const newAccount = await Account.create({
      name,
      number,
      currency_code,
      opening_balance,
      bank_name,
      bank_phone,
      bank_address,
      enabled,
      store_id: storeId
    });

    return res.status(201).json(newAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
};

// Get all accounts for a store
exports.getAccountsByStore = async (req, res) => {
  try {
    const storeId = req.params.store_id;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const accounts = await Account.findAll({
      where: { store_id: storeId }
    });

    return res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve accounts' });
  }
};

// Get a single account by ID
exports.getAccountById = async (req, res) => {
  try {
    const accountId = req.params.account_id;

    const account = await Account.findByPk(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.status(200).json(account);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve account' });
  }
};

// Update an account
exports.updateAccount = async (req, res) => {
  try {
    const accountId = req.params.account_id;

    const account = await Account.findByPk(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const updatedAccount = await account.update(req.body);

    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update account' });
  }
};

// Delete an account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const accountId = req.params.account_id;

    const account = await Account.findByPk(accountId);

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await account.destroy();  // This will perform a soft delete if paranoid is enabled

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
};
