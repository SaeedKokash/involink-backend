'use strict';

module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        tax_number: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.TEXT,
        },
        website: {
            type: DataTypes.STRING,
        },
        currency_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        reference: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: true,
        paranoid: true,
    });

    Contact.associate = function (models) {
        Contact.belongsTo(models.Store, {
            foreignKey: 'store_id',
            as: 'store',
        });
        Contact.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
        // Contact.hasMany(models.Transaction, {
        //     foreignKey: 'contact_id',
        //     as: 'transactions',
        // });
    }

    return Contact;
}