// models/UserRole.js

module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
      user_id: { type: DataTypes.INTEGER, primaryKey: true },
      role_id: { type: DataTypes.INTEGER, primaryKey: true },
      user_type: { type: DataTypes.STRING, primaryKey: true },
    }, {
      tableName: 'user_roles',
      timestamps: false,
      underscored: true,
    });
  
    return UserRole;
  };
  