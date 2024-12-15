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
    tableName: 'store',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  Store.associate = (models) => {
    Store.belongsToMany(models.User, {
      through: models.UserStore,
      foreignKey: 'store_id',
      otherKey: 'user_id',
    });
    Store.hasMany(models.Account, { foreignKey: 'store_id' });
    Store.hasMany(models.Item, { foreignKey: 'store_id' });
    Store.hasMany(models.Contact, { foreignKey: 'store_id' });
    Store.hasMany(models.Tax, { foreignKey: 'store_id' });
    Store.hasMany(models.Invoice, { foreignKey: 'store_id' });
    Store.hasMany(models.Transaction, { foreignKey: 'store_id' });
    Store.hasMany(models.InvoiceHistory, { foreignKey: 'store_id' });
    Store.hasMany(models.Media, { foreignKey: 'store_id' });
  };

  return Store;
};
