// models/Permission.js

module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
      name: { type: DataTypes.STRING, unique: true, allowNull: false },
      display_name: DataTypes.STRING,
      description: DataTypes.STRING,
    }, {
      tableName: 'permissions',
      timestamps: true,
      underscored: true,
    });
  
    Permission.associate = (models) => {
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
      });
      Permission.belongsToMany(models.User, {
        through: models.UserPermission,
        foreignKey: 'permission_id',
        otherKey: 'user_id',
      });
    };
  
    return Permission;
  };
  