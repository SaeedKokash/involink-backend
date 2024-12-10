// models/UserStore.js

module.exports = (sequelize, DataTypes) => {
  const UserStore = sequelize.define('UserStore', {
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
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },

    role: {
      type: DataTypes.STRING, // Consider using ENUM
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Role of the user in the store, e.g., "admin", "manager"',
    },
    access_level: {
      type: DataTypes.STRING, // Consider using ENUM
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: 'Access level, e.g., "full", "read-only"',
    },
  }, {
    tableName: 'user_store',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'store_id'],
        name: 'user_store_user_id_store_id_unique',
      },
    ],
  });

  UserStore.associate = (models) => {
    UserStore.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
    UserStore.belongsTo(models.Store, { foreignKey: 'store_id', as: 'Store' });
  };

  return UserStore;
};
