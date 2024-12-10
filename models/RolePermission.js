// models/RolePermission.js

module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
  }, {
    tableName: 'role_permissions',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['role_id', 'permission_id'],
        name: 'role_permissions_role_id_permission_id_unique',
      },
    ],
  });

  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Role, { foreignKey: 'role_id', as: 'Role' });
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permission_id', as: 'Permission' });
  };

  return RolePermission;
};
