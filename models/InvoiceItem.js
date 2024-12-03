// models/InvoiceItem.js

module.exports = (sequelize, DataTypes) => {
    const InvoiceItem = sequelize.define('InvoiceItem', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      invoice_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,

      quantity: DataTypes.INTEGER,
      price: DataTypes.DOUBLE,
      total: DataTypes.DOUBLE,

      tax: DataTypes.DOUBLE, // should this be a foreign key to a tax table? or should it be a string of the tax total amount?

      discount_rate: DataTypes.DOUBLE, // should this be a foreign key to a discount table? or should it be a string of the discount rate?
      discount_type: DataTypes.STRING, // should this be a foreign key to a discount table? or should it be a string of the discount type?

      custom_item_description: DataTypes.STRING,
    }, {
      tableName: 'invoice_items',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    InvoiceItem.associate = (models) => {
      InvoiceItem.belongsTo(models.Store, { foreignKey: 'store_id' });
      InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
      InvoiceItem.belongsTo(models.Item, { foreignKey: 'item_id' });
    };
  
    return InvoiceItem;
  };
  