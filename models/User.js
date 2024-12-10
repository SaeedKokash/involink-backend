// models/User.js

'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the user',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'users_email_deleted_at_unique',
      validate: {
        isEmail: true,
        notEmpty: true,
      },
      comment: 'Email address of the user',
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
      comment: 'Phone number of the user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Hashed password of the user',
    },
    remember_token: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Token for "remember me" functionality',
    },
    last_logged_in_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp of the last login',
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Locale preference of the user, e.g., "en-US"',
    },
    landing_page: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL or identifier for the user\'s landing page after login',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the user account is active',
    },
    isVerifiedEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the user email is verified',
    },
    isVerifiedNumber: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the user phone number is verified',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email', 'deleted_at'],
        name: 'users_email_deleted_at_unique',
      },
    ],
  });

  User.prototype.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // User Associations
  User.associate = (models) => {
    // Many-to-Many: User <-> Media through UserMedia
    User.belongsToMany(models.Media, {
      through: models.UserMedia,
      as: 'Media',
      foreignKey: 'user_id',
      otherKey: 'media_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Many-to-Many: User <-> Store through UserStore
    User.belongsToMany(models.Store, {
      through: models.UserStore,
      as: 'Stores',
      foreignKey: 'user_id',
      otherKey: 'store_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // One-to-Many: User has many RefreshTokens
    User.hasMany(models.RefreshToken, { foreignKey: 'user_id', as: 'RefreshTokens' });

    // Many-to-Many: User <-> Role through UserRole
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      as: 'Roles',
      foreignKey: 'user_id',
      otherKey: 'role_id',
      constraints: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

  };

  return User;
};
