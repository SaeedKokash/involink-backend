// models/Permission.js

module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
      name: { type: DataTypes.STRING, unique: true, allowNull: false },
      description: DataTypes.STRING,
    }, {
      tableName: 'permissions',
      timestamps: true,
      underscored: true,
    });

    // permissions is a many to many relation with role through role_permissions table

    Permission.associate = (models) => {
      Permission.belongsToMany(models.Role, {
          through: models.RolePermission,
          foreignKey: 'permission_id',
          otherKey: 'role_id',
          constraints: false,
        });
    }
  
    return Permission;
  };
  