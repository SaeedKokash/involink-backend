































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
  
    Item.associate = function(models) {
      Item.belongsTo(models.Store, { foreignKey: 'storeId' });
    };
  
    return Item;
  };
  