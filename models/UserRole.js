// models/UserRole.js

module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
      user_id: { type: DataTypes.INTEGER, primaryKey: true },
      role_id: { type: DataTypes.INTEGER, primaryKey: true },
    }, {
      tableName: 'user_roles',
      timestamps: false,
      underscored: true,
    });

    // user_roles is a many to many relation with user and role

    UserRole.associate = (models) => {
      UserRole.belongsTo(models.User, { foreignKey: 'user_id' });
      UserRole.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
  
    return UserRole;
  };
  