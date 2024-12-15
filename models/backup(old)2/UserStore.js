// models/UserStore.js

module.exports = (sequelize, DataTypes) => {
    const UserStore = sequelize.define('UserStore', {
      user_id: { type: DataTypes.INTEGER, primaryKey: true },
      store_id: { type: DataTypes.INTEGER, primaryKey: true },
      user_type: { type: DataTypes.STRING, primaryKey: true },
    }, {
      tableName: 'user_stores',
      timestamps: false,
      underscored: true,
    });
  
    return UserStore;
  };
  