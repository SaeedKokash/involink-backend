'use strict';

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
      name: { type: DataTypes.STRING, unique: true, allowNull: false },
      display_name: DataTypes.STRING,
      description: DataTypes.STRING,
    }, {
      tableName: 'roles',
      timestamps: true,
      underscored: true,
    });
  
    Role.associate = (models) => {
      Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id',
      });
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
      });
    };
  
    return Role;
  };
  