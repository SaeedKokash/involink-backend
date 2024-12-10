// models/Role.js

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the role, e.g., "admin", "manager"',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Description of the role',
    },

  }, {
    tableName: 'roles',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
        name: 'roles_name_unique',
      },
    ],
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      as: 'Users',
      foreignKey: 'role_id',
      otherKey: 'user_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      as: 'Permissions',
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Role;
};
