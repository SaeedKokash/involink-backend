const { Tax, Store, 
    // InvoiceItemTax, BillItemTax
 } = require('../models'); // Import necessary models

// Create a new tax
exports.createTax = async (req, res) => {
  try {
    const { store_id, name, rate, type, enabled } = req.body;

    // Check if the store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
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
    console.error(error);
    return res.status(500).json({ error: 'Failed to create tax' });
  }
};

// Get all taxes for a store
exports.getTaxesByStore = async (req, res) => {
  try {
    const storeId = req.params.store_id;

    // Check if the store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Retrieve all taxes for the store
    const taxes = await Tax.findAll({
      where: { store_id: storeId },
    });

    return res.status(200).json(taxes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve taxes' });
  }
};

// Get a single tax by ID
exports.getTaxById = async (req, res) => {
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
exports.updateTax = async (req, res) => {
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
exports.deleteTax = async (req, res) => {
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
