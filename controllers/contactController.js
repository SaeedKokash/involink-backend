const { Contact, Store, User } = require('../models'); // Assuming your models are in a folder called models

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      type,
      tax_number,
      phone,
      address,
      website,
      currency_code,
      enabled,
      reference,
      store_id,
      user_id,
    } = req.body;

    // Check if the store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Optionally check if the user exists if `user_id` is provided
    if (user_id) {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    // Create the contact
    const newContact = await Contact.create({
      name,
      email,
      type,
      tax_number,
      phone,
      address,
      website,
      currency_code,
      enabled,
      reference,
      store_id,
      user_id,
    });

    return res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create contact' });
  }
};

// Get all contacts for a store
exports.getContactsByStore = async (req, res) => {
  try {
    const storeId = req.params.store_id;

    // Check if the store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Retrieve all contacts for the store
    const contacts = await Contact.findAll({
      where: { store_id: storeId },
    });

    return res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve contacts' });
  }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contactId = req.params.contact_id;

    // Find the contact by ID
    const contact = await Contact.findByPk(contactId, {
      include: [
        { model: Store, attributes: ['store_name'] },
        { model: User, attributes: ['name', 'email'] },  // Optional inclusion of user if associated
      ],
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve contact' });
  }
};

// Update a contact
exports.updateContact = async (req, res) => {
  try {
    const contactId = req.params.contact_id;

    // Find the contact by ID
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Update the contact
    const updatedContact = await contact.update(req.body);

    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update contact' });
  }
};

// Delete a contact (soft delete)
exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.contact_id;

    // Find the contact by ID
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Soft delete the contact (if paranoid is enabled)
    await contact.destroy();

    return res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete contact' });
  }
};
