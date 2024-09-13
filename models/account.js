'use strict';

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currency_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        opening_balance: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        bank_name: {
            type: DataTypes.STRING,
        },
        bank_phone: {
            type: DataTypes.STRING,
        },
        bank_address: {
            type: DataTypes.TEXT,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    }, {
        timestamps: true,
        paranoid: true,
    });

    Account.associate = function (models) {
        Account.belongsTo(models.Store, { foreignKey: 'store_id' });
        // Account.hasMany(models.Transaction, { foreignKey: 'account_id' });
      };

    return Account;
}

