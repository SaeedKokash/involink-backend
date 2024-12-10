// models/Permission.js

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the permission, e.g., "create_user", "delete_invoice"',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Description of the permission',
    },
  }, {
    tableName: 'permissions',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'deleted_at'],
        name: 'permissions_name_deleted_at_unique',
      },
    ],
  });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      as: 'Roles',
      foreignKey: 'permission_id',
      otherKey: 'role_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Permission;
};
