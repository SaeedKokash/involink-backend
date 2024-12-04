// models/Role.js

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: DataTypes.STRING,
    
  }, {
    tableName: 'roles',
    timestamps: true,
    underscored: true,
  });

  // roles is a many to many relation with user through user_roles table

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id', 
        constraints: false,
      });
  }

  return Role;
};
