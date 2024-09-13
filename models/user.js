'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'merchant', 'customer'),
      defaultValue: 'customer',
      allowNull: false,
    },
    permissions: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          admin: ['create', 'read', 'update', 'delete'],
          merchant: ['create', 'read', 'update'],
          customer: ['read'],
        };
        return acl[this.role];
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    lastLoggedInAt: {
      type: DataTypes.DATE,
    },
    locale: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    landingPage: {
      type: DataTypes.STRING,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }
  }, {
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
  });

  User.prototype.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Define the many-to-many relationship with Permission
  User.associate = function (models) {
    User.belongsToMany(models.Store, { through: models.UserStore, foreignKey: 'user_id' });
    User.hasMany(models.Contact, { foreignKey: 'user_id' });
    // User.belongsToMany(models.Permission, { through: models.UserPermissions, foreignKey: 'user_id' });
    // User.belongsToMany(models.Role, { through: models.UserRoles, foreignKey: 'user_id' });
  };

  return User;
};
