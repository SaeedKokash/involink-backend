'use strict';
const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');

// Sign a new access token
exports.signAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // 15-minute expiration for access token
  );
};

// Sign a new refresh token
exports.signRefreshToken = async (user) => {
  console.log(user.id,user.email, user.role)
  const refreshToken = jwt.sign(
    { id: user.id,email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // 7-day expiration for refresh token
  );

  // Store the refresh token in the database
  await RefreshToken.create({
    token: refreshToken,
    expiryDate: RefreshToken.generateExpiryDate(), // Helper to set expiry date in model
    UserId: user.id,
  });

  return refreshToken;
};

// Verify a token
exports.verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

