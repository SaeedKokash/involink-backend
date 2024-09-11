const createError = require('http-errors');
const logger = require('../config/logger');
const { verifyToken } = require('../utils/tokenUtils');

// // Middleware to protect routes with access tokens
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided');
      throw createError(401, 'You are not logged in!');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    req.user = decoded;
    logger.info(`User ${decoded.id} authenticated successfully`);
    next();
  } catch (err) {
    logger.warn(`Token verification failed: ${err.message}`);
    next(createError(401, 'Invalid or expired token!'));
  }
};

// Middleware to restrict access to specific roles
exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      logger.warn(`User role ${req.user.role} is not authorized to access this route`);
      return next(createError(403, 'You do not have permission to perform this action!'));
    }
    next();
  }
};

// // Middleware to handle refresh tokens
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn('No refresh token provided');
      throw createError(401, 'Refresh token is required!');
    }

    const decoded = await verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    logger.warn(`Refresh token verification failed: ${err.message}`);
    next(createError(401, 'Invalid or expired refresh token!'));
  }
};

