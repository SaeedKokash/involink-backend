// models/UserStoreAccess.js

module.exports = (sequelize, DataTypes) => {
    const UserStoreAccess = sequelize.define('UserStoreAccess', {
      user_id: { type: DataTypes.INTEGER, primaryKey: true },
      store_id: { type: DataTypes.INTEGER, primaryKey: true },

      role: { type: DataTypes.STRING, allowNull: false },
      access_level: { type: DataTypes.STRING, allowNull: false },
    }, {
      tableName: 'user_store_access',
      timestamps: false,
      underscored: true,
    });

    UserStoreAccess.associate = (models) => {
      UserStoreAccess.belongsTo(models.User, { foreignKey: 'user_id' });
      UserStoreAccess.belongsTo(models.Store, { foreignKey: 'store_id' });
    };
  
    return UserStoreAccess;
  };
  