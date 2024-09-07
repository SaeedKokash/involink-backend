// models/invoice.js
module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
      invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'canceled'),
        allowNull: false,
      },
    });
  
    Invoice.associate = function(models) {
      Invoice.belongsTo(models.Store, { foreignKey: 'storeId' });
      Invoice.belongsTo(models.User, { as: 'customer', foreignKey: 'customerId' });
    };
  
    return Invoice;
  };
  