const logger = require('../config/logger');
const { verifyToken } = require('../utils/tokenUtils');
const { User, Role, UserStore } = require('../models');

// Middleware to authenticate user
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided');
      return next({ statusCode: 401, message: 'Authorization header missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, { 
      include: [
      {
        model: Role,
        as: 'Roles',
        attributes: ['name'],
        through: { attributes: [] }
      }
    ]
    });
    if (!user) return next({ statusCode: 401, message: 'User not found!' });
    req.user = user;

    // Fetch associated stores
    const userStores = await UserStore.findAll({
      where: { user_id: req.user.id },
      // include: [{ model: Store }],
    });

    // const stores = userStores.map(userStore => console.log(userStore.store_id));

    req.user.stores = userStores.map(us => us.store_id);

    logger.info(`User ${decoded.id} authenticated successfully`);
    next();
  } catch (err) {
    logger.warn(`Token verification failed: ${err.message}`);
    next({ statusCode: 401, message: 'Invalid or expired token!' });
  }
};

// Middleware to restrict access to specific roles

// Version 1
// exports.authorize = (requiredRole) => (req, res, next) => {
//   if (req.user.Roles.some(role => role.name === requiredRole)) {
//     next();
//   } else {
//     logger.warn(`User ${req.user.id} is not authorized to access this resource`);
//     next({ statusCode: 403, message: 'You are not authorized to access this resource' })
//   }
// };

// Version 2
exports.authorize = (requiredRole) => async (req, res, next) => {
  try {
    const user = req.user;
    const roles = await user.getRoles({ attributes: ['name'] });
    if (roles.some(role => role.name === requiredRole)) {
      next();
    } else {
      logger.warn(`User ${user.id} is not authorized to access this resource`);
      next({ statusCode: 403, message: 'You are not authorized to access this resource' });
    }
  } catch (err) {
    logger.error(`Error authorizing user: ${err.message}`);
    next(err);
  }
};

// Version 3
// exports.authorize = (requiredRoles = []) => {
//   return (req, res, next) => {
//     const userRoles = req.user.Roles.map((role) => role.name);

//     const hasRole = requiredRoles.some((role) => userRoles.includes(role));

//     if (!hasRole) {
//       return res.status(403).json({ message: 'Forbidden: Access is denied.' });
//     }

//     next();
//   };
// };
    
// Middleware to handle refresh tokens
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

