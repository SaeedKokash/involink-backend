// models/RefreshToken.js

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    user_id: {
      type: DataTypes.INTEGER,
    },
    token: {
      type: DataTypes.STRING,
    },
    expiry_date: {
      type: DataTypes.DATE,
    },
  },{
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
  });

  // Helper to check if token is expired
  RefreshToken.isExpired = function(token) {
    return token.expiry_date.getTime() < new Date().getTime();
  };

  // Helper to generate an expiry date for refresh tokens (7 days from now)
  RefreshToken.generateExpiryDate = function() {
    const now = new Date();
    now.setDate(now.getDate() + 7); // Set expiry to 7 days
    return now;
  };

  // refreshtoken has many to one relation with user
  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'user_id' });
  }

  return RefreshToken;
};
