// models/Item.js

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    name: DataTypes.STRING,
    sku: { type: DataTypes.STRING, unique: 'store_sku_deleted_at' },
    description: DataTypes.TEXT,
    sale_price: DataTypes.DOUBLE,
    purchase_price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    tax_id: DataTypes.INTEGER,
    enabled: DataTypes.BOOLEAN,
  }, {
    tableName: 'items',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'sku', 'deleted_at'],
        name: 'items_store_id_sku_deleted_at_unique',
      },
    ],
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Store, { foreignKey: 'store_id' });
    Item.belongsTo(models.Tax, { foreignKey: 'tax_id' });
    Item.hasMany(models.InvoiceItem, { foreignKey: 'item_id' });
  };

  return Item;
};
