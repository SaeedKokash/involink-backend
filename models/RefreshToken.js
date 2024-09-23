"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Helper to check if token is expired
  RefreshToken.isExpired = function(token) {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  // Helper to generate an expiry date for refresh tokens (7 days from now)
  RefreshToken.generateExpiryDate = function() {
    const now = new Date();
    now.setDate(now.getDate() + 7); // Set expiry to 7 days
    return now;
  };

  return RefreshToken;
};
