const { Account } = require('../models');
const logger = require('../config/logger');
const { paginate } = require('../utils/pagination');

// Create a new account
exports.createAccount = async (req, res, next) => {
  try {
    const { name, number, currency_code, opening_balance, bank_name, bank_phone, bank_address, enabled } = req.body;

    const storeId = req.body.store_id || req.params.store_id;  // Make sure the store ID is provided

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
    logger.error(`Error creating account: ${error.message}`);
    next(error);
  }
};

// Get all accounts for a store
exports.getAccountsByStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // You can adjust the limit
    const search = req.query.search || '';

    const where = {
      store_id: storeId,
      ...(search && { name: { [Op.iLike]: `%${search}%` } }),
    };

    const result = await paginate({
      model: Account, 
      page, 
      limit, 
      where, order: [['createdAt', 'DESC']]
  });

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error retrieving accounts: ${error.message}`);
    next(error);
  }
};

// Get a single account by ID
exports.getAccountById = async (req, res, next) => {
  try {
    const accountId = req.params.account_id;

    const account = await Account.findByPk(accountId);

    if (!account) {
      return next({ statusCode: 404, message: 'Account not found' });
    }

    return res.status(200).json(account);
  } catch (error) {
    logger.error(`Error retrieving account: ${error.message}`);
    next(error);
  }
};

// Update an account
exports.updateAccount = async (req, res, next) => {
  try {
    const accountId = req.params.account_id;

    const account = await Account.findByPk(accountId);

    if (!account) {
      return next({ statusCode: 404, message: 'Account not found' });
    }

    const updatedAccount = await account.update(req.body);

    return res.status(200).json(updatedAccount);
  } catch (error) {
    logger.error(`Error updating account: ${error.message}`);
    next(error);
  }
};

// Delete an account (soft delete)
exports.deleteAccount = async (req, res, next) => {
  try {
    const accountId = req.params.account_id;

    const account = await Account.findByPk(accountId);

    if (!account) {
      return next({ statusCode: 404, message: 'Account not found' });
    }

    await account.destroy();  // This will perform a soft delete if paranoid is enabled

    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting account: ${error.message}`);
    next(error);
  }
};
