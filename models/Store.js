'use strict';

module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    street_address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    zip_code: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },

    logo: {
      type: DataTypes.STRING,
    }, // should this be a foreign key to media table??

  }, {
    tableName: 'store',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  // store has relations with: 
  // 1. has many to many relation with media through store_media table, store_id is the foreign key
  // 2. has one to many relation with item table, store_id is the foreign key
  // 3. has one to many relation with invoiceItem table, store_id is the foreign key
  // 4. has one to many relation with invoices table, store_id is the foreign key
  // 5. has one to many relation with accounts table, store_id is the foreign key
  // 6. has one to many relation with transactions table, store_id is the foreign key
  // 7. has one to many relation with contacts table, store_id is the foreign key
  // 8. has many to many relation with user through user_store_access table, store_id is the foreign key
  
  Store.associate = (models) => {
    Store.belongsToMany(models.Media, {
      through: models.StoreMedia,
      foreignKey: 'store_id',    // The foreign key in 'StoreMedia' pointing to 'Store'
      otherKey: 'media_id',   // The foreign key in 'StoreMedia' pointing to 'Media'
      constraints: false,
    });

    Store.hasMany(models.Item, { foreignKey: 'store_id' });
    Store.hasMany(models.InvoiceItem, { foreignKey: 'store_id' });
    Store.hasMany(models.Invoice, { foreignKey: 'store_id' });
    Store.hasMany(models.Account, { foreignKey: 'store_id' });
    Store.hasMany(models.Transaction, { foreignKey: 'store_id' });
    Store.hasMany(models.Contact, { foreignKey: 'store_id' });

    Store.belongsToMany(models.User, {
      through: models.UserStoreAccess,
      foreignKey: 'store_id',    // The foreign key in 'UserStoreAccess' pointing to 'Store'
      otherKey: 'user_id',   // The foreign key in 'UserStoreAccess' pointing to 'User'
      constraints: false,
    });
  }

  return Store;
};
