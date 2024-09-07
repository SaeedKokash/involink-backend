'use strict';

module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    store_name: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    address: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  Store.associate = function (models) {
    Store.belongsTo(models.User, { foreignKey: 'userId' });
    Store.hasMany(models.Item, { foreignKey: 'storeId' });
    Store.hasMany(models.Invoice, { foreignKey: 'storeId' });
  };

  return Store;
};
