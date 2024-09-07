const { User, Permission } = require('../models');

// Utility function to assign permissions to a user
exports.assignPermissionsToUser = async (userId, permissionNames) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const permissions = await Permission.findAll({
    where: { name: permissionNames },
  });

  await user.setPermissions(permissions);
};

// Utility function to assign permissions to a role
exports.assignPermissionsToRole = async (role, permissionNames) => {
  const users = await User.findAll({ where: { role } });
  const permissions = await Permission.findAll({
    where: { name: permissionNames },
  });

  for (const user of users) {
    await user.setPermissions(permissions);
  }
};
