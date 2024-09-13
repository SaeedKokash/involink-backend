'use strict';

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    store_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    invoice_number: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    order_number: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    invoiced_at: {
      type: DataTypes.DATE,
      // allowNull: false,
    },
    due_at: {
      type: DataTypes.DATE,
      // allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      // allowNull: false,
    },
    currency_code: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    currency_rate: {
      type: DataTypes.FLOAT,
      // allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    contact_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    contact_name: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    contact_email: {
      type: DataTypes.STRING,
    },
    contact_tax_number: {
      type: DataTypes.STRING,
    },
    contact_phone: {
      type: DataTypes.STRING,
    },
    contact_address: {
      type: DataTypes.TEXT,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    footer: {
      type: DataTypes.TEXT,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  Invoice.associate = function (models) {
    Invoice.belongsTo(models.Store, { foreignKey: 'store_id' });
    Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoice_id' });
    // Invoice.hasMany(models.InvoiceItemTax, { foreignKey: 'invoice_id' });
    Invoice.belongsTo(models.Contact, { foreignKey: 'contact_id' });
    Invoice.hasMany(models.RequestToPay, { foreignKey: 'invoice_id' });
    // Invoice.hasMany(models.InvoiceHistory, { foreignKey: 'invoice_id' });
  };

  return Invoice;
};
