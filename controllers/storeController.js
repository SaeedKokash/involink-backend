const { Store, User, TaxRates, Invoice, Item, Contact, Account, Transaction, Media, UserStore, Role, Alias } = require('../models'); 
const logger = require('../config/logger');
const { uploadFileToExternal } = require('../services/uploadImageService');

// Create a new store
exports.createStore = async (req, res, next) => {
  const transaction = await Store.sequelize.transaction();
  try {
    const {
      name,
      enabled,
      street_address,
      city,
      zip_code,
      phone_number,
      email
    } = req.body;
    const user = req.user;

    // Step 1: Create the store so we get an ID
    const newStore = await Store.create({
      name,
      enabled: enabled === undefined ? true : enabled,
      street_address,
      city,
      zip_code,
      phone_number,
      email,
    }, { transaction });

    // Associate the store with the user first (if you must do this before upload)
    await newStore.addUser(user, {
      through: { role: 'Merchant', access_level: 'all' },
      transaction,
    });

    await user.addRole(2, { transaction });

    let logoMedia = null;

    // If a file was uploaded, upload it now with a filename based on store id & name
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const originalName = req.file.originalname;
      const mimeType = req.file.mimetype;
      const size = req.file.size;

      // Sanitize the store name to avoid invalid filename characters
      const sanitizedStoreName = name
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.\-_]/g, '');

      // Construct the desired filename: storeid-storename-logo
      // You can also try to retain the original extension from originalName if desired
      const originalExtension = originalName.split('.').pop();
      const constructedFileName = `${newStore.id}-${sanitizedStoreName}-logo.${originalExtension}`;

      // Upload the file using the constructed filename
      const { fileName: returnedFileName, fileUrl } = await uploadFileToExternal(fileBuffer, constructedFileName, mimeType);

      const extension = returnedFileName.split('.').pop();

      logoMedia = await Media.create({
        disk: 'azure',
        directory: 'store-logos',
        filename: returnedFileName,
        extension,
        mime_type: mimeType,
        size,
        path: fileUrl,
      }, { transaction });

      // Associate the media as the store's logo
      await newStore.addMedia(logoMedia, {
        through: { tag: 'logo', url: logoMedia.path },
        transaction,
      });
    }

    await transaction.commit();

    return res.status(201).json(newStore);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error creating store: ${error.message}`);
    next(error);
  }
};

// Get all stores for a user
exports.getStoresByUser = async (req, res, next) => {
  try {
    const user = req.user;

    // Retrieve all stores associated with the user without 
    const userStores = await user.getStores({
      attributes: ['id', 'name', 'enabled', 'street_address', 'city', 'zip_code', 'phone_number', 'email'], // Store attributes
      through: { attributes: [] }, // Exclude the through table attributes
      include: [
        {
          model: User,
          as: 'Users',
          attributes: ['id', 'name', 'email'], // User attributes
          through: { attributes: [] }, // Exclude the through table attributes
        },
        {
          model: Account, 
          as: 'Accounts',
          attributes: ['name'], // Account attributes
          include: [
            {
              model: Alias,
              as: 'Aliases',
              attributes: ['id', 'type', 'value'], // Alias attributes
              through: { attributes: [] }, // Exclude pivot table details
            },
          ],
        },
        {
          model: Item,
          as: 'Items',
          attributes: ['name'], // Item attributes
        },
        {
          model: Contact,
          as: 'Contacts',
          attributes: ['name'], // Contact attributes
        },
        {
          model: TaxRates,
          as: 'TaxRates',
          attributes: ['name', 'rate'], // TaxRates attributes
        },
        {
          model: Invoice,
          as: 'Invoices',
          attributes: ['id', 'amount', 'status'], // Invoice attributes
        },
   
        {
          model: Transaction,
          as: 'Transactions',
          attributes: ['amount', 'type'], // Transaction attributes
        },
        // store has many Media through StoreMedia association
        {
          model: Media,
          as: 'Media',
          attributes: ['filename'], // Media attributes
          through: { attributes: ['url'] }, // Exclude the through table attributes
        },
      ],
    });

    return res.status(200).json(userStores);
  } catch (error) {
    logger.error(`Error retrieving stores: ${error.message}`);
    next(error);
  }
};

// Get a single store by ID, including associated data
exports.getStoreById = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;

    // Fetch the store by ID, including related data like users, taxes, items, etc.
    const store = await Store.findByPk(storeId, {
      attributes: ['id', 'name', 'enabled', 'street_address', 'city', 'zip_code', 'phone_number', 'email'], // Store attributes
      through: { attributes: [] }, // Exclude the through table attributes
      include: [
        {
          model: User,
          as: 'Users',
          attributes: ['id', 'name', 'email'], // User attributes
          through: { attributes: [] }, // Exclude the through table attributes
        },
        {
          model: Account, 
          as: 'Accounts',
          attributes: ['name'], // Account attributes
          include: [
            {
              model: Alias,
              as: 'Aliases',
              attributes: ['id', 'type', 'value'], // Alias attributes
              through: { attributes: [] }, // Exclude pivot table details
            },
          ],
        },
        {
          model: Item,
          as: 'Items',
          attributes: ['name'], // Item attributes
        },
        {
          model: Contact,
          as: 'Contacts',
          attributes: ['name'], // Contact attributes
        },
        {
          model: TaxRates,
          as: 'TaxRates',
          attributes: ['name', 'rate'], // TaxRates attributes
        },
        {
          model: Invoice,
          as: 'Invoices',
          attributes: ['id', 'amount', 'status'], // Invoice attributes
        },
   
        {
          model: Transaction,
          as: 'Transactions',
          attributes: ['amount', 'type'], // Transaction attributes
        },
        // store has many Media through StoreMedia association
        {
          model: Media,
          as: 'Media',
          attributes: ['filename'], // Media attributes
          through: { attributes: ['url'] }, // Exclude the through table attributes
        },
      ],
    });

    if (!store) {
      return next({ statusCode: 404, message: 'Store not found' });
    }

    return res.status(200).json(store);
  } catch (error) {
    logger.error(`Error retrieving store: ${error.message}`);
    next(error);
  }
};

// Update a store
exports.updateStore = async (req, res, next) => {
  const transaction = await Store.sequelize.transaction();
  try {
    const storeId = req.params.store_id;

    // Check user's role in this store
    const userRoleInStore = req.userStore.role;
    const roleRecord = await Role.findOne({ where: { name: userRoleInStore }, include: 'Permissions' });
    if (!roleRecord) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Invalid role configuration.' });
    }

    // Check if the role grants the "update_store" permission
    const canEditStore = roleRecord.Permissions.some(permission => permission.name === 'update_store');
    if (!canEditStore) {
      await transaction.rollback();
      return res.status(403).json({ error: 'You are not allowed to edit this store.' });
    }

    // Find the store by ID
    let store = await Store.findByPk(storeId, { transaction });
    if (!store) {
      await transaction.rollback();
      return next({ statusCode: 404, message: 'Store not found' });
    }

    // Update store fields first
    await store.update(req.body, { transaction });

    let logoMedia = null;

    if (req.file) {
      // A new logo was uploaded
      const fileBuffer = req.file.buffer;
      const originalName = req.file.originalname;
      const mimeType = req.file.mimetype;
      const size = req.file.size;

      // After updating, store.name may have changed, so use the current store name
      const sanitizedStoreName = store.name
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.\-_]/g, '');

      const originalExtension = originalName.split('.').pop();
      const constructedFileName = `${store.id}-${sanitizedStoreName}-logo.${originalExtension}`;

      const { fileName: returnedFileName, fileUrl } = await uploadFileToExternal(fileBuffer, constructedFileName, mimeType);
      const extension = returnedFileName.split('.').pop();

      // Create the new media record
      logoMedia = await Media.create({
        disk: 'azure',
        directory: 'store-logos',
        filename: returnedFileName,
        extension,
        mime_type: mimeType,
        size,
        path: fileUrl,
      }, { transaction });

      // Remove existing logo(s) - fetch current media associated as 'logo'
      const currentLogos = await store.getMedia({
        through: { where: { tag: 'logo' } },
        transaction
      });

      if (currentLogos.length > 0) {
        // Remove them
        for (const oldLogo of currentLogos) {
          await store.removeMedia(oldLogo, { transaction });
        }
      }

      // Add the new logo
      await store.addMedia(logoMedia, {
        through: { tag: 'logo', url: logoMedia.path },
        transaction,
      });
    }

    await transaction.commit();
    return res.status(200).json(store);
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error updating store: ${error.message}`);
    next(error);
  }
};

// Delete a store (soft delete)
exports.deleteStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;

    // Find the store by ID
    const store = await Store.findByPk(storeId);

    if (!store) {
      return next({ statusCode: 404, message: 'Store not found' });
    }

    // Soft delete the store (if paranoid is enabled)
    await store.destroy();

    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting store: ${error.message}`);
    next(error);
  }
};

// Restore a deleted store
exports.restoreStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;

    // Restore the store
    const store = await Store.restore({ where: { id: storeId } });

    if (!store) {
      return next({ statusCode: 404, message: 'Store not found' });
    }

    return res.status(200).json(store);
  } catch (error) {
    logger.error(`Error restoring store: ${error.message}`);
    next(error);
  }
};

// Add a user to a store as an employee
exports.addUserToStoreAsEmployee = async (req, res) => {
  try {
    const { userId, storeId } = req.params; // assuming you pass these as URL params

    const userRoleInStore = req.userStore.role; // For example: "owner" or "employee"
    
    const roleRecord = await Role.findOne({ where: { name: userRoleInStore }, include: 'Permissions' });
    if (!roleRecord) {
      return res.status(403).json({ error: 'Invalid role configuration.' });
    }

    // 3. Check if the role grants the "edit_store" permission
    const canEditStore = roleRecord.Permissions.some(permission => permission.name === 'add_user_to_store');

    if (!canEditStore) {
      return res.status(403).json({ error: 'You are not allowed to edit this store.' });
    }

    // Verify the store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found.' });
    }

    // Verify the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if this user is already associated with the store
    const existingAssociation = await UserStore.findOne({
      where: { user_id: userId, store_id: storeId }
    });

    if (existingAssociation) {
      return res.status(409).json({ error: 'User already associated with this store.' });
    }

    // Create the association with role = 'employee'
    // Set access_level to something suitable, e.g., 'read-write'
    const userStore = await UserStore.create({
      user_id: userId,
      store_id: storeId,
      role: 'employee',
      access_level: 'read-write'
    });

    return res.status(201).json({
      message: 'User added to the store as an employee successfully.',
      data: userStore
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
