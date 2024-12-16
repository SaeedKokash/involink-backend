"use strict";

const { User, Store, Role, Permission, Media } = require("../models");
const logger = require("../config/logger");
const { paginate } = require("../utils/pagination");

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // You can pass additional filters or sorting options if needed
    const paginatedUsers = await paginate({
      model: User,
      page,
      limit,
      where: {},
      options: {
        order: [["createdAt", "DESC"]],
      },
    });

    res.status(200).json(paginatedUsers);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check if the user is accessing their own profile or is an admin
    const isAdmin = req.user.roles.includes("Admin"); // Check if user has 'Admin' role

    // check if the user is an admin or the user themselves
    if (!isAdmin && req.user.id !== Number(userId)) {
      return next({
        statusCode: 403,
        message: "You do not have permission to perform this action!",
      });
    }

    // Fetch the user by ID, including related data
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Store,
          as: "Stores",
          through: { attributes: [] }, // Exclude the UserStore join table
        },
        {
          model: Role,
          as: "Roles",
          attributes: ["name", "description"],
          through: { attributes: [] }, // Exclude the UserRole join table
          include: [
            {
              model: Permission,
              as: "Permissions",
              attributes: ["name", "description"],
              through: { attributes: [] }, // Exclude the RolePermission join table
            },
          ],
        },
        {
          model: Media,
          as: "Media",
          through: { attributes: [] }, // Exclude the UserMedia join table
        },
      ],
    });

    if (!user) {
      return next({ statusCode: 404, message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching User data: ${error.message}`);
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { password, ...rest } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return next({ statusCode: 404, message: "User not found" });
    }

    // Check if the user is accessing their own profile or is an admin
    const isAdmin = req.user.roles.includes("Admin"); // Check if user has 'Admin' role

    // check if the user is an admin or the user themselves
    if (!isAdmin && req.user.id !== Number(userId)) {
      return next({
        statusCode: 403,
        message: "You do not have permission to perform this action!",
      });
    }

    // If password is provided, it will trigger the beforeUpdate hook to hash it
    if (password) {
      rest.password = password; // Just assign the raw password and let the Sequelize hook handle hashing
    }

    // Update the user
    const updatedUser = await user.update(rest);

    return res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating User: ${error.message}`);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return next({ statusCode: 400, message: "User ID is required!" });
    }

    // Perform a soft delete by setting 'deletedAt' instead of removing the record
    const deletedUser = await User.destroy({ where: { id: userId } });
    if (!deletedUser) {
      return next({ statusCode: 404, message: "User not found!" });
    }

    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting User: ${error.message}`);
    next(error);
  }
};

exports.restoreUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return next({ statusCode: 400, message: "User ID is required!" });
    }

    const user = await User.restore({ where: { id: userId } });

    if (!user) {
      return next({ statusCode: 404, message: "User not found!" });
    }

    res.status(200).json({ message: `User with ID ${userId} has been restored` });
  } catch (error) {
    logger.error(`Error restoring User: ${error.message}`);
    next(error);
  }
};
