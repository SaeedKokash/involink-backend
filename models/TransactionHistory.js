// models/TransactionHistory.js

module.exports = (sequelize, DataTypes) => {
    const TransactionHistory = sequelize.define('TransactionHistory', {
      transaction_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },

      change_type: DataTypes.STRING,
      changed_at: DataTypes.DATE,
      old_value: DataTypes.JSON,
      new_value: DataTypes.JSON,


    }, {
      tableName: 'transaction_history',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    TransactionHistory.associate = (models) => {
      TransactionHistory.belongsTo(models.Transaction, { foreignKey: 'transaction_id' });
      TransactionHistory.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return TransactionHistory;
  };
  