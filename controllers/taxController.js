const { Tax, Store, UserStore  
    // InvoiceItemTax, BillItemTax
 } = require('../models'); // Import necessary models'
 const { paginate } = require('../utils/pagination');
 const { Op } = require('sequelize');
 const logger = require('../config/logger');

// Create a new tax
exports.createTax = async (req, res, next) => {
  try {
    const { store_id, name, rate, type, enabled } = req.body;

    // Check if user has access to the store
    const userStore = await UserStore.findOne({
      where: { user_id: req.user.id, store_id },
    });

    if (!userStore) {
      next({ statusCode: 403, message: 'You are not authorized to access this resource' });
    }

    // Create the tax
    const newTax = await Tax.create({
      store_id,
      name,
      rate,
      type,
      enabled,
    });

    return res.status(201).json(newTax);
  } catch (error) {
    logger.error(`Error creating tax: ${error.message}`);
    next(error);
  }
};

// Get all taxes for a store
exports.getTaxesByStore = async (req, res, next) => {
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
      model: Tax, 
      page, 
      limit, 
      where,
      order: [['createdAt', 'DESC']] 
  });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to retrieve taxes' });
  }
};

// Get a single tax by ID
exports.getTaxById = async (req, res, next) => {
  try {
    const taxId = req.params.tax_id;

    // Fetch the tax by ID
    const tax = await Tax.findByPk(taxId, {
      include: [
        { model: Store, attributes: ['store_name'] },
        // { model: InvoiceItemTax },
        // { model: BillItemTax },
      ],
    });

    if (!tax) {
      return res.status(404).json({ error: 'Tax not found' });
    }

    return res.status(200).json(tax);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve tax' });
  }
};

// Update a tax
exports.updateTax = async (req, res, next) => {
  try {
    const taxId = req.params.tax_id;

    // Find the tax by ID
    const tax = await Tax.findByPk(taxId);

    if (!tax) {
      return res.status(404).json({ error: 'Tax not found' });
    }

    // Update the tax
    const updatedTax = await tax.update(req.body);

    return res.status(200).json(updatedTax);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update tax' });
  }
};

// Delete a tax (soft delete)
exports.deleteTax = async (req, res, next) => {
  try {
    const taxId = req.params.tax_id;

    // Find the tax by ID
    const tax = await Tax.findByPk(taxId);

    if (!tax) {
      return res.status(404).json({ error: 'Tax not found' });
    }

    // Soft delete the tax (if paranoid is enabled)
    await tax.destroy();

    return res.status(200).json({ message: 'Tax deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete tax' });
  }
};
