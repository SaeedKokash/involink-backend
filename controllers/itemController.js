const { Item, UserStore, Store, Tax, 
  // Category
} = require('../models'); // Import necessary models
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
      enabled,
      store_id
    } = req.body;

    // Check if user has access to the store
    const userStore = await UserStore.findOne({
      where: { user_id: req.user.id, store_id },
    });

    if (!userStore) {
      next({ statusCode: 403, message: 'You are not authorized to access this resource' });
    }

    // Ensure SKU is unique per store
    if (sku) {
      const existingItem = await Item.findOne({
        where: { store_id, sku },
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
      store_id,
    });

    console.log(newItem);

    return res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    logger.error(`Error creating item: ${error.message}`);
    next(error);
  }
};

// Get all items for a store
exports.getItemsByStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;
    const search = req.query.search;
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
    console.log(error);
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
        // { model: Category, attributes: ['name'] },
        { model: Tax, attributes: ['name', 'rate'] },
      ],
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve item' });
  }
};

// Update an item
exports.updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.item_id;

    // Find the item by ID
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if the store, category, or tax need to be validated
    const { category_id, tax_id, store_id } = req.body;

    if (store_id) {
      const store = await Store.findByPk(store_id);
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
    }

    // if (category_id) {
    //   const category = await Category.findByPk(category_id);
    //   if (!category) {
    //     return res.status(404).json({ error: 'Category not found' });
    //   }
    // }

    if (tax_id) {
      const tax = await Tax.findByPk(tax_id);
      if (!tax) {
        return res.status(404).json({ error: 'Tax not found' });
      }
    }

    // Update the item
    const updatedItem = await item.update(req.body);

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update item' });
  }
};

// Delete an item (soft delete)
exports.deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.item_id;

    // Find the item by ID
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Soft delete the item (if paranoid is enabled)
    await item.destroy();

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete item' });
  }
};
