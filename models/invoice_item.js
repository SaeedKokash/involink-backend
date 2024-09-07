'use strict';

module.exports = (sequelize, DataTypes) => {
    const InvoiceItem = sequelize.define('InvoiceItem', {
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sku: {
            type: DataTypes.STRING,
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        tax: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        discount_rate: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        discount_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
    });

    InvoiceItem.associate = (models) => {
      InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
      InvoiceItem.belongsTo(models.Item, { foreignKey: 'item_id' });
    };

    return InvoiceItem;
}