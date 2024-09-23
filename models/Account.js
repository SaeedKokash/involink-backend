// models/Account.js

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      name: DataTypes.STRING,
      number: DataTypes.STRING,
      currency_code: DataTypes.STRING,
      opening_balance: DataTypes.DOUBLE,
      bank_name: DataTypes.STRING,
      bank_phone: DataTypes.STRING,
      bank_address: DataTypes.TEXT,
      enabled: DataTypes.BOOLEAN,
    }, {
      tableName: 'accounts',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    Account.associate = (models) => {
      Account.belongsTo(models.Store, { foreignKey: 'store_id' });
      Account.hasMany(models.Transaction, { foreignKey: 'account_id' });
    };
  
    return Account;
  };
  