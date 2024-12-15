// models/Transaction.js

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
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
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'id',
      },
      onDelete: 'SET NULL',
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
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'invoices',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Type of transaction, e.g., "credit", "debit"',
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when the transaction was paid',
    },

    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Amount of the transaction',
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[A-Z]{3}$/,
      },
      comment: 'Currency code, e.g., "USD", "EUR"',
    },

    currency_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      validate: {
        min: 0,
      },
      comment: 'Exchange rate at the time of transaction',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the transaction',
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Payment method used, e.g., "credit card", "bank transfer"',
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Reference ID from payment provider or internal systems',
    },

    reconciled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the transaction has been reconciled',
    },

    msgId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Message ID from payment gateway or provider',
    },

    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'approved', 'rejected', 'completed']],
      },
      comment: 'Status of the transaction',
    },

  }, {
    tableName: 'transactions',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        fields: ['store_id', 'type'],
        name: 'transactions_store_id_type_index',
      },
      {
        fields: ['invoice_id'],
        name: 'transactions_invoice_id_index',
      },
    ],
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
    Transaction.belongsTo(models.Account, { foreignKey: 'account_id', as: 'Account' });
    Transaction.belongsTo(models.Contact, { foreignKey: 'contact_id', as: 'Contact' });
    Transaction.belongsTo(models.Invoice, { foreignKey: 'invoice_id', as: 'Invoice' });
  };

  return Transaction;
};
