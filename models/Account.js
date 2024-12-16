// models/Account.js

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Account Name e.g. "Checking Account"',
    },
    BICCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [8, 11], // BIC codes are typically 8 or 11 characters
      },
      comment: 'Participant BIC Code e.g. "ABCDUS33XXX"',
    },

    // Either bank_account_number or IBAN should be provided
    bank_account_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, 34], // IBANs are between 8 and 34 characters
      },
      comment: 'Bank Account Number e.g. "1234567890"',
    },
    IBAN: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIBAN(value) {
          if (value && !/^([A-Z]{2}\d{2}[A-Z0-9]{1,30})$/.test(value)) {
            throw new Error('Invalid IBAN format');
          }
        },
      },
      comment: 'International Bank Account Number e.g. "DE89370400440532013000"',
    },

    currency_code: {
      type: DataTypes.ENUM('JOD', 'USD'), // Expand as needed
      allowNull: false,
      defaultValue: 'JOD',
      validate: {
        isIn: [['JOD', 'USD']],
      },
    },

    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    bank_phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[+]?[0-9\s\-()]+$/, // Simple phone number validation
      },
    },
    bank_street_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_zip_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

  }, {
    tableName: 'accounts',
    timestamps: true,
    paranoid: true,
    underscored: true,
    validate: {
      eitherBankAccountOrIBAN() {
        if (!this.bank_account_number && !this.IBAN) {
          throw new Error('Either bank_account_number or IBAN must be provided');
        }
      },
    },
  });

  Account.associate = (models) => {
    // Each Account belongs to one Store
    Account.belongsTo(models.Store, {
      foreignKey: 'store_id',
      as: 'Stores',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Each Account has many Transactions
    Account.hasMany(models.Transaction, {
      foreignKey: 'account_id',
      as: 'Transactions',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // Many-to-Many: Account <-> Alias through AccountAlias
    Account.belongsToMany(models.Alias, {
      through: models.AccountAlias,
      as: 'Aliases',
      foreignKey: 'account_id',
      otherKey: 'alias_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Account;
};
