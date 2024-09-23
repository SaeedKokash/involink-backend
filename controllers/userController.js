'use strict';

const { User, Store, Role, Permission, Contact } = require('../models');
const logger = require('../config/logger');
const { paginate } = require('../utils/pagination');

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // You can pass additional filters or sorting options if needed
    const paginatedUsers = await paginate(User, page, limit, {}, [['createdAt', 'DESC']]);

    res.status(200).json(paginatedUsers);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Fetch the user by ID, including stores, roles, and permissions
    const user = await User.findByPk(userId, {
      include: [
        { model: Store, attributes: ['store_name'] },
        { model: Role, attributes: ['name'] },
        { model: Permission, attributes: ['name'] },
        { model: Contact },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching User data: ${error.message}`);
    next(error);
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { password, ...rest } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // only admins or the user themselves can update their profile
    if (req.user.role !== 'admin' && Number(userId) !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to perform this action!' });
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
}

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required!' });
    }

    // only admins or the user themselves can delete their profile
    if (req.user.role !== 'admin' && Number(id) !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to perform this action!' });
    }

    // Perform a soft delete by setting 'deletedAt' instead of removing the record
    const deletedUser = await User.destroy({ where: { id } });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: `User with ID ${id} has been deleted` });
  } catch (error) {
    logger.error(`Error deleting User: ${error.message}`);
    next(error);
  }
}

exports.restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required!' });
    }

    const user = await User.restore({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: `User with ID ${id} has been restored` });
  } catch (error) {
    logger.error(`Error restoring User: ${error.message}`);
    next(error);
  }
}


