// models/Transaction.js

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      type: DataTypes.STRING,
      paid_at: DataTypes.DATE,
      amount: DataTypes.DOUBLE,
      currency_code: DataTypes.STRING,
      currency_rate: DataTypes.DOUBLE,
      account_id: DataTypes.INTEGER,
      document_id: DataTypes.INTEGER,
      contact_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      payment_method: DataTypes.STRING,
      reference: DataTypes.STRING,
      parent_id: DataTypes.INTEGER,
      reconciled: DataTypes.BOOLEAN,
    }, {
      tableName: 'transactions',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    Transaction.associate = (models) => {
      Transaction.belongsTo(models.Store, { foreignKey: 'store_id' });
      Transaction.belongsTo(models.Account, { foreignKey: 'account_id' });
      Transaction.belongsTo(models.Contact, { foreignKey: 'contact_id' });
      // Add associations to invoices or other documents if needed
    };
  
    return Transaction;
  };
  