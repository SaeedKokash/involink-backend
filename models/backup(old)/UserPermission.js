// models/UserPermission.js

module.exports = (sequelize, DataTypes) => {
    const UserPermission = sequelize.define('UserPermission', {
      user_id: { type: DataTypes.INTEGER, primaryKey: true },
      permission_id: { type: DataTypes.INTEGER, primaryKey: true },
      user_type: { type: DataTypes.STRING, primaryKey: true },
    }, {
      tableName: 'user_permissions',
      timestamps: false,
      underscored: true,
    });
  
    return UserPermission;
  };
  