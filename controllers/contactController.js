const { Contact, UserStore, Store, User } = require('../models'); // Assuming your models are in a folder called models

const logger = require('../config/logger');
const { paginate } = require('../utils/pagination');

// Create a new contact
exports.createContact = async (req, res, next) => {
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
      user_id = req.user.id,
    } = req.body;

    // Check if user has access to the store
    const userStore = await UserStore.findOne({
      where: { user_id: req.user.id, store_id },
    });

    if (!userStore) {
      next({ statusCode: 403, message: 'You are not authorized to access this resource' });
    }

    // Ensure email is unique per store and type
    if (email) {
      const existingContact = await Contact.findOne({
        where: { store_id, type, email },
      });
      if (existingContact) {
        next({ statusCode: 400, message: 'Contact with email already exists' });
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
    logger.error(`Error creating contact: ${error.message}`);
    next(error);
  }
};

// Get all contacts for a store
exports.getContactsByStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // You can adjust the limit
    const search = req.query.search || '';

    const where = {
      store_id: storeId,
      ...(search && { name: { [Op.iLike]: `%${search}%` } }),
    };

    const paginatedContacts = await paginate({
      model: Contact, 
      page, 
      limit, 
      where, 
      order: [['createdAt', 'DESC']]});

    return res.status(200).json(paginatedContacts);
  } catch (error) {
    logger.error(`Error retrieving contacts: ${error.message}`);
    next(error);
  }
};

// Get a single contact by ID
exports.getContactById = async (req, res, next) => {
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
      return next({ statusCode: 404, message: 'Contact not found' });
    }

    return res.status(200).json(contact);
  } catch (error) {
    logger.error(`Error retrieving contact: ${error.message}`);
    next(error);
  }
};

// Update a contact
exports.updateContact = async (req, res, next) => {
  try {
    const contactId = req.params.contact_id;

    // Find the contact by ID
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return next({ statusCode: 404, message: 'Contact not found' });
    }

    // Update the contact
    const updatedContact = await contact.update(req.body);

    return res.status(200).json(updatedContact);
  } catch (error) {
    logger.error(`Error updating contact: ${error.message}`);
    next(error);
  }
};

// Delete a contact (soft delete)
exports.deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.contact_id;

    // Find the contact by ID
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return next({ statusCode: 404, message: 'Contact not found' });
    }

    // Soft delete the contact (if paranoid is enabled)
    await contact.destroy();

    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting contact: ${error.message}`);
    next(error);
  }
};
