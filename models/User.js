'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
    },
    email: { type: DataTypes.STRING, unique: 'email_deleted_at', allowNull: false },
    password: {
      type: DataTypes.STRING,
    },
    remember_token: {
      type: DataTypes.STRING,
    },
    last_logged_in_at: {
      type: DataTypes.DATE,
    },
    locale: {
      type: DataTypes.STRING,
    },
    landing_page: {
      type: DataTypes.STRING, // what is the landing_page for?
    },
    enabled: {
      type: DataTypes.BOOLEAN,
    },

  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true,
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

  // user has relations with:
  // 1. has many to many relation with media thorugh user_media table, user_id is the foreign key
  // 2. has many to many relation with store thorugh user_store_access table, user_id is the foreign key
  // 3. one to many relation with contact table, user_id is the foreign key
  // 4. one to many relation with refresh_token table, user_id is the foreign key
  // 5. one to many relation with transaction_history table, user_id is the foreign key
  // 6. has many to many relation with role through user_role table, user_id is the foreign key

  User.associate = (models) => {
    User.belongsToMany(models.Media, {
      through: models.UserMedia,
      foreignKey: 'user_id',    // The foreign key in 'UserMedia' pointing to 'User'
      otherKey: 'media_id',   // The foreign key in 'UserMedia' pointing to 'Media'
      constraints: false,
    });

    User.belongsToMany(models.Store, {
      through: models.UserStoreAccess,
      foreignKey: 'user_id',    // The foreign key in 'UserStoreAccess' pointing to 'User'
      otherKey: 'store_id',   // The foreign key in 'UserStoreAccess' pointing to 'Store'
      constraints: false,
    });

    User.hasMany(models.Contact, { foreignKey: 'user_id' });

    User.hasMany(models.RefreshToken, { foreignKey: 'user_id' }); // check this

    User.hasMany(models.TransactionHistory, { foreignKey: 'user_id' });

    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'user_id',    // The foreign key in 'UserRole' pointing to 'User'
      otherKey: 'role_id',   // The foreign key in 'UserRole' pointing to 'Role'
      constraints: false,
    });
  }



  return User;
};
