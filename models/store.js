// models/store.js
module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Store.associate = function(models) {
      Store.belongsTo(models.User, { foreignKey: 'userId' });
      Store.hasMany(models.Item, { foreignKey: 'storeId' });
      Store.hasMany(models.Invoice, { foreignKey: 'storeId' });
    };
  
    return Store;
  };
  