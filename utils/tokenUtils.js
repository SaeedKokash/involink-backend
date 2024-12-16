// utils/tokenUtils.js

const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');
const logger = require('../config/logger');

/**
 * Sign a new access token.
 * @param {Object} userWithRoles - The user object including roles.
 * @returns {String} - The signed JWT access token.
 */
exports.signAccessToken = (userWithRoles) => {
  const roles = userWithRoles.Roles.map(role => role.name); // Extract role names
  logger.info(`Signing access token for user ID: ${userWithRoles.id} with roles: ${roles.join(', ')}`);

  return jwt.sign(
    {
      id: userWithRoles.id,
      email: userWithRoles.email,
      phone_number: userWithRoles.phone_number,
      roles: roles, // Include role names
    },
    process.env.JWT_SECRET,
    { expiresIn: '3h' } // 3-hour expiration for access token
  );
};

/**
 * Sign a new refresh token and store it in the database.
 * @param {Object} userWithRoles - The user object including roles.
 * @param {Object} transaction - The Sequelize transaction instance.
  * @returns {Promise<String>} - The signed JWT refresh token.
 */
exports.signRefreshToken = async (userWithRoles, transaction) => {
  const roles = userWithRoles.Roles.map(role => role.name); // Extract role names
  logger.info(`Signing refresh token for user ID: ${userWithRoles.id} with roles: ${roles.join(', ')}`);

  const refreshToken = jwt.sign(
    {
      id: userWithRoles.id,
      email: userWithRoles.email,
      phone_number: userWithRoles.phone_number,
      roles: roles, // Include role names
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // 7-day expiration for refresh token
  );

  console.log('refreshToken', refreshToken);

  // Store the refresh token in the database within the transaction
  logger.info(`Creating refresh token in DB for user ID: ${userWithRoles.id}`);
  await RefreshToken.create(
    {
      token: refreshToken,
      expiry_date: RefreshToken.generateExpiryDate(), // Assuming this is a valid method
      user_id: userWithRoles.id,
    },
    { transaction } // Pass the transaction here
  );

  return refreshToken;
};

/**
 * Verify a JWT token.
 * @param {String} token - The JWT token to verify.
 * @param {String} secret - The secret key to verify the token.
 * @returns {Object} - The decoded token payload.
 */
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
