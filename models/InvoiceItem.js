// models/InvoiceItem.js

module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define('InvoiceItem', {
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invoices',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    tax_amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    discount_amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },

    grand_total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      comment: 'Calculated as (quantity x price) + tax_amount - discount_amount',
    },
    custom_item_description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Custom description for the item in the invoice',
    },
  }, {
    tableName: 'invoice_items',
    timestamps: true,
    paranoid: true,
    underscored: true,

    hooks: {
      beforeCreate: (invoiceItem, options) => {
        invoiceItem.grand_total = (invoiceItem.quantity * invoiceItem.price) + (invoiceItem.tax_amount || 0) - (invoiceItem.discount_amount || 0);
        if (invoiceItem.grand_total < 0) {
          throw new Error('Grand total cannot be negative');
        }
      },
      beforeUpdate: (invoiceItem, options) => {
        if (invoiceItem.changed('quantity') || invoiceItem.changed('price') || invoiceItem.changed('tax_amount') || invoiceItem.changed('discount_amount')) {
          invoiceItem.grand_total = (invoiceItem.quantity * invoiceItem.price) + (invoiceItem.tax_amount || 0) - (invoiceItem.discount_amount || 0);
          if (invoiceItem.grand_total < 0) {
            throw new Error('Grand total cannot be negative');
          }
        }
      }
    },
  });

  InvoiceItem.associate = (models) => {
    InvoiceItem.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoice_id', as: 'Invoice' });
    InvoiceItem.belongsTo(models.Item, { foreignKey: 'item_id', as: 'Item' });
  };

  return InvoiceItem;
};
