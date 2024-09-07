'use strict';

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    sku: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    sale_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
    },
    tax_id: {
      type: DataTypes.INTEGER,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  // // Define the relationship with Store
  Item.associate = (models) => {
    Item.belongsTo(models.Store, { foreignKey: 'store_id' });
  };

  return Item;
};























// models/item.js
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Item.associate = function (models) {
    Item.belongsTo(models.Store, { foreignKey: 'storeId' });
  };

  return Item;
};
