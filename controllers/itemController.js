const { Item, Store, Tax } = require('../models'); // Import necessary models
const logger = require('../config/logger');
const { paginate } = require('../utils/pagination');
const { Op } = require('sequelize');

// Create a new item
exports.createItem = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      description,
      sale_price,
      purchase_price,
      quantity,
      category_id,
      tax_id,
      enabled
    } = req.body;

    const storeId = req.params.store_id;

    // Ensure SKU is unique per store
    if (sku) {
      const existingItem = await Item.findOne({
        where: { storeId, sku },
      });
      if (existingItem) {
        next({ statusCode: 400, message: 'SKU already exists' });
      }
    }

    // Create the item
    const newItem = await Item.create({
      name,
      sku,
      description,
      sale_price,
      purchase_price,
      quantity,
      category_id,
      tax_id,
      enabled,
      store_id: storeId,
    });

    return res.status(201).json(newItem);
  } catch (error) {
    logger.error(`Error creating item: ${error.message}`);
    next(error);
  }
};

// Get all items for a store
exports.getItemsByStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;
    
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // You can pass additional filters or sorting options if needed
    const paginatedItems = await paginate({ 
      model: Item, 
      page, 
      limit, 
      where: {
      store_id: storeId,
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
      ],
    }
    , 
    order: [['createdAt', 'DESC']]
  });

    return res.status(200).json(paginatedItems);
  } catch (error) {
    logger.error(`Error retrieving items: ${error.message}`);
    next(error);
  }
};

// Get a single item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const itemId = req.params.item_id;

    // Fetch the item by ID, including related category and tax details
    const item = await Item.findByPk(itemId, {
      include: [
        { model: Tax, attributes: ['name', 'rate'] },
      ],
    });

    if (!item) {
      return next({ statusCode: 404, message: 'Item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    logger.error(`Error retrieving item: ${error.message}`);
    next(error);
  }
};

// Update an item
exports.updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.item_id;

    // Find the item by ID
    const item = await Item.findByPk(itemId);

    if (!item) {
      return next({ statusCode: 404, message: 'Item not found' });
    }

    // Check if the store, category, or tax need to be validated
    const { tax_id, store_id } = req.body;

    if (store_id) {
      const store = await Store.findByPk(store_id);
      if (!store) {
        return next({ statusCode: 404, message: 'Store not found' });
      }
    }

    if (tax_id) {
      const tax = await Tax.findByPk(tax_id);
      if (!tax) {
        return next({ statusCode: 404, message: 'Tax not found' });
      }
    }

    // Update the item
    const updatedItem = await item.update(req.body);

    return res.status(200).json(updatedItem);
  } catch (error) {
    logger.error(`Error updating item: ${error.message}`);
    next(error);
  }
};

// Delete an item (soft delete)
exports.deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.item_id;

    // Find the item by ID
    const item = await Item.findByPk(itemId);

    if (!item) {
      return next({ statusCode: 404, message: 'Item not found' });
    }

    // Soft delete the item (if paranoid is enabled)
    await item.destroy();

    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting item: ${error.message}`);
    next(error);
  }
};