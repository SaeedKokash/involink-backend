const { Account, Alias } = require("../models");
const logger = require("../config/logger");
const { paginate } = require("../utils/pagination");

// Create a new account
exports.createAccount = async (req, res, next) => {
  const transaction = await Account.sequelize.transaction();
  try {
    const {
      name,
      BICCode,
      bank_account_number,
      IBAN,
      currency_code,
      bank_name,
      bank_phone,
      bank_street_address,
      bank_city,
      bank_zip_code,
      enabled,
      alias_type,
      alias_value,
    } = req.body;

    const storeId = req.params.store_id; // Ensure store ID is provided

    // Create the Account
    const newAccount = await Account.create(
      {
        name,
        BICCode,
        bank_account_number,
        IBAN,
        currency_code,
        bank_name,
        bank_phone,
        bank_street_address,
        bank_city,
        bank_zip_code,
        enabled,
        store_id: storeId,
      },
      { transaction }
    );

    // Check if alias already exists and link or create
    let alias = await Alias.findOne({ where: { value: alias_value, type: alias_type }, transaction });
    if (!alias) {
      alias = await Alias.create(
        {
          value: alias_value,
          type: alias_type,
        },
        { transaction }
      );
    }

    await newAccount.addAlias(alias, { transaction });

    // Commit the transaction
    await transaction.commit();

    return res.status(201).json(newAccount);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error creating account: ${error.message}`);
    next(error);
  }
};

// Get all accounts for a store
exports.getAccountsByStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id; // Ensure store ID is provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    if (!storeId) {
      return res.status(400).json({ message: 'Store ID is required.' });
    }

    const where = {
      store_id: storeId,
      ...(search && { name: { [Op.iLike]: `%${search}%` } }),
    };

    const result = await paginate({
      model: Account,
      page,
      limit,
      where,
      options: {
        include: [
          {
            model: Alias,
            as: 'Aliases',
            through: { attributes: [] }, // Exclude pivot table details
          },
        ],
        order: [["createdAt", "DESC"]],
      },
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

    const account = await Account.findByPk(accountId, {
      include: [
        {
          model: Alias,
          as: 'Aliases',
          through: { attributes: [] }, // Exclude pivot table details
        },
      ],
    });

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

    await account.destroy(); // This will perform a soft delete if paranoid is enabled

    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting account: ${error.message}`);
    next(error);
  }
};

// Restore a deleted account
exports.restoreAccount = async (req, res, next) => {
  try {
    const accountId = req.params.account_id;

    const account = await Account.findByPk(accountId, { paranoid: false });

    if (!account) {
      return next({ statusCode: 404, message: 'Account not found' });
    }

    await account.restore();

    return res.status(200).json({ message: 'Account restored successfully.', account });
  } catch (error) {
    logger.error(`Error restoring account: ${error.message}`);
    next(error);
  }
};