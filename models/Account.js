// models/Account.js

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    name: DataTypes.STRING, // Account Name e.g. "Checking Account"
    BICCode: DataTypes.STRING, // Participant BIC Code e.g. "ABCDUS33XXX"

    // either bank_account_number or IBAN or alias or all of them should be provided
    bank_account_number: DataTypes.STRING, // Bank Account Number e.g. "1234567890"
    IBAN: DataTypes.STRING, // International Bank Account Number e.g. "DE89370400440532013000"

    // Alias for the account
    alias_type: {
      type: DataTypes.ENUM('alias', 'iban', 'mobile'),
    },
    alias_value: {
      type: DataTypes.STRING,
      unique: true, // should be unique?
    },

    currency_code: {
      type: DataTypes.ENUM('JOD', 'USD'),
      defaultValue: 'JOD',
    },
    bank_name: DataTypes.STRING,
    bank_phone: DataTypes.STRING,
    bank_street_address: DataTypes.STRING,
    bank_city: DataTypes.STRING,
    bank_zip_code: DataTypes.STRING,
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
