// models/UserRole.js

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
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
  }, {
    tableName: 'user_roles',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'role_id'],
        name: 'user_roles_user_id_role_id_unique',
      },
    ],
  });

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
    UserRole.belongsTo(models.Role, { foreignKey: 'role_id', as: 'Role' });
  };

  return UserRole;
};
