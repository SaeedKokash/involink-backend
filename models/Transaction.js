// models/Transaction.js

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      account_id: DataTypes.INTEGER,
      contact_id: DataTypes.INTEGER,

      type: DataTypes.STRING,
      paid_at: DataTypes.DATE,

      amount: DataTypes.DOUBLE,
      currency_code: DataTypes.STRING,

      currency_rate: DataTypes.DOUBLE, // do we need this?

      description: DataTypes.TEXT,
      payment_method: DataTypes.STRING,
      reference: DataTypes.STRING,
  
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

      Transaction.hasMany(models.TransactionHistory, { foreignKey: 'transaction_id' });
    };
  
    return Transaction;
  };
  