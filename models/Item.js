// models/Item.js

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    tax_id: DataTypes.INTEGER, // should this be here or in the invoice item?

    name: DataTypes.STRING,
    sku: { type: DataTypes.STRING, unique: 'store_sku_deleted_at' }, // what is the unique constraint here?
    description: DataTypes.TEXT,

    // item_image should be a (bytea) type in postgres
    item_image: DataTypes.BLOB, // should we keep it as item_image or just image?

    sale_price: DataTypes.DOUBLE,
    purchase_price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER,

    enabled: DataTypes.BOOLEAN,
  }, {
    tableName: 'items',
    timestamps: true,
    paranoid: true,
    underscored: true,
    // what are the indexes here?
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

    // check other relations... (tax_rates, item_media)
  };

  return Item;
};
