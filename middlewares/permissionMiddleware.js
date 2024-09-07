const { User, Permission } = require('../models');

// Middleware to check if a user has a specific permission
exports.checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: {
          model: Permission,
          through: {
            attributes: [],
          },
        },
      });

      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      // Check if the user has the required permission
      const hasPermission = user.Permissions.some(
        (permission) => permission.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Permission check failed', error: error.message });
    }
  };
};
