// models/Invoice.js

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
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
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false,
      // Unique constraint handled by index
    },

    order_number: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Order number to be filled by merchant',
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'sent', 'paid', 'overdue', 'cancelled']],
      },
      comment: 'Status of the invoice',
    },

    invoiced_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when the invoice was created',
    },
    due_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Due date for the invoice payment',
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when the invoice was paid',
    },

    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Total amount of the invoice',
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[A-Z]{3}$/, // Simple currency code validation
      },
      comment: 'Currency code, e.g., "USD", "EUR"',
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes for the invoice',
    },
    footer: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Footer text for the invoice',
    },

  }, {
    tableName: 'invoices',
    timestamps: true,
    paranoid: true,
    underscored: true,

    indexes: [
      {
        unique: true,
        fields: ['store_id', 'invoice_number', 'deleted_at'],
        name: 'invoices_store_id_invoice_number_deleted_at_unique',
      },
    ],

    hooks: {
      beforeCreate: async (invoice, options) => {
        const Store = invoice.sequelize.models.Store;
        const store = await Store.findByPk(invoice.store_id, { transaction: options.transaction });
        if (!store) {
          throw new Error('Store not found');
        }

        // Count existing invoices for the store
        const count = await Invoice.count({
          where: {
            store_id: invoice.store_id,
            deleted_at: null,
          },
          transaction: options.transaction,
        });

        // Generate invoice number
        const invoiceNumber = `INV-STR${store.id}-${String(count + 1).padStart(6, '0')}`;
        invoice.invoice_number = invoiceNumber;
      }
    }
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    Invoice.belongsTo(models.Contact, { foreignKey: 'contact_id', as: 'Contact' });

    Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoice_id', as: 'InvoiceItems' });
    Invoice.hasMany(models.Transaction, { foreignKey: 'invoice_id', as: 'Transactions' });

    // Many-to-Many: Invoice <-> Media through InvoiceMedia
    Invoice.belongsToMany(models.Media, {
      through: models.InvoiceMedia,
      as: 'Media',
      foreignKey: 'invoice_id',
      otherKey: 'media_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Invoice;
};
