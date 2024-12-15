// models/InvoiceItem.js

module.exports = (sequelize, DataTypes) => {
    const InvoiceItem = sequelize.define('InvoiceItem', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      invoice_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      sku: DataTypes.STRING,
      quantity: DataTypes.DOUBLE,
      price: DataTypes.DOUBLE,
      total: DataTypes.DOUBLE,
      tax: DataTypes.DOUBLE,
      discount_rate: DataTypes.DOUBLE,
      discount_type: DataTypes.STRING,
    }, {
      tableName: 'invoice_items',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    InvoiceItem.associate = (models) => {
      InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
      InvoiceItem.belongsTo(models.Item, { foreignKey: 'item_id' });
    };
  
    return InvoiceItem;
  };
  