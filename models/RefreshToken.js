// models/RefreshToken.js

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Refresh token string',
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Expiration date of the refresh token',
    },
  }, {
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['token'],
        name: 'refresh_tokens_token_unique',
      },
    ],
  });

  // Define class methods
  RefreshToken.isExpired = function (tokenInstance) {
    return tokenInstance.expiry_date.getTime() < new Date().getTime();
  };

  RefreshToken.generateExpiryDate = function () {
    const now = new Date();
    now.setDate(now.getDate() + 7); // Set expiry to 7 days
    return now;
  };

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
  };

  return RefreshToken;
};
