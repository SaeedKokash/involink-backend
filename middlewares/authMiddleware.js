const logger = require('../config/logger');
const { verifyToken } = require('../utils/tokenUtils');
const { User, Role, Permission } = require('../models');

// Middleware to ensure the user is authenticated and roles/permissions are attached to the request
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided');
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'Roles',
          attributes: ['name'],
          through: {
            attributes: [],
          },
          include: [
            {
              model: Permission,
              as: 'Permissions',
              attributes: ['name'],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Flatten permissions
    const permissionSet = new Set();
    const permissions = [];
    for (const role of user.Roles) {
      for (const permission of role.Permissions) {
        if (!permissionSet.has(permission.name)) {
          permissionSet.add(permission.name);
          permissions.push(permission.name);
        }
      }
    }

    const roles = user.Roles.map((role) => role.name);
    
    user.permissions = permissions; // Store only the permission names for quick checks
    user.roles = roles; // Store only the role names for quick checks
    req.user = user; 

    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if the user has at least one of the specified roles
exports.checkRole = (...requiredRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      const userRoles = user.Roles.map((role) => role.name);

      // Check if user has at least one of the required roles
      const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

      if (hasRequiredRole) {
        return next();
      } else {
        logger.warn(`User ${user.id} does not have the required role(s): ${requiredRoles.join(', ')}`);
        return res.status(403).json({ message: 'Access denied: Insufficient role' });
      }
    } catch (error) {
      logger.error(`Error checking role: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check if the user has a specific permission
exports.checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      // user.permissions is an array of permission names strings
      const userPermissions = new Set(user.permissions);
      const hasRequiredPermission = requiredPermissions.some(permission => userPermissions.has(permission));

      if (hasRequiredPermission) {
        return next();
      } else {
        logger.warn(`User ${user.id} does not have the required permission(s): ${requiredPermissions.join(', ')}`);
        return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      }
    } catch (error) {
      logger.error(`Error checking permission: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

