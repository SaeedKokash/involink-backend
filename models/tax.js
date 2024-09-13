'use strict';

module.exports = (sequelize, DataTypes) => {
    const Tax = sequelize.define('Tax', {
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rate: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
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

    Tax.associate = function (models) {
        Tax.belongsTo(models.Store, { foreignKey: 'store_id' });
        // Tax.hasMany(models.InvoiceItemTax, { foreignKey: 'tax_id' });
        // Tax.hasMany(models.BillItemTax, { foreignKey: 'tax_id' });
      };

    return Tax;
}
