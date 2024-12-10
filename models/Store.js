// models/Store.js

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the store',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the store is active',
    },
    street_address: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Street address of the store',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'City where the store is located',
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ZIP code of the store location',
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[+]?[0-9\s\-()]+$/,
      },
      comment: 'Contact phone number for the store',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: 'Contact email for the store',
    },

  }, {
    tableName: 'stores',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'deleted_at'],
        name: 'stores_name_deleted_at_unique',
      },
    ],
  });

  // Store Associations
  Store.associate = (models) => {
    // Many-to-Many: Store <-> Media through StoreMedia
    Store.belongsToMany(models.Media, {
      through: models.StoreMedia,
      as: 'Media',
      foreignKey: 'store_id',
      otherKey: 'media_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // One-to-Many: Store has many Items
    Store.hasMany(models.Item, { foreignKey: 'store_id', as: 'Items' });

    // One-to-Many: Store has many InvoiceItems
    Store.hasMany(models.InvoiceItem, { foreignKey: 'store_id', as: 'InvoiceItems' });

    // One-to-Many: Store has many Invoices
    Store.hasMany(models.Invoice, { foreignKey: 'store_id', as: 'Invoices' });

    // One-to-Many: Store has many Accounts
    Store.hasMany(models.Account, { foreignKey: 'store_id', as: 'Accounts' });

    // One-to-Many: Store has many Transactions
    Store.hasMany(models.Transaction, { foreignKey: 'store_id', as: 'Transactions' });

    // One-to-Many: Store has many Contacts
    Store.hasMany(models.Contact, { foreignKey: 'store_id', as: 'Contacts' });

    // Many-to-Many: Store <-> User through UserStore
    Store.belongsToMany(models.User, {
      through: models.UserStore,
      as: 'Users',
      foreignKey: 'store_id',
      otherKey: 'user_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Store;
};
