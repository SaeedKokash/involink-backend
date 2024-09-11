'use strict';

const { User } = require('../models');
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
    const { id } = req.params;
    const userData = await User.findByPk(id);

    res.status(200).json({ userData });
  } catch (error) {
    logger.error(`Error fetching User data: ${error.message}`);
    next(error);
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    if (!id || !body) {
      return res.status(400).json({ message: 'User ID and data are required!' });
    }

    // only admins or the user themselves can update their profile
    if (req.user.role !== 'admin' && Number(id) !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to perform this action!' });
    }

    // update the user and send back the new data specifically updated by the user
    await User.update(body, { where: { id } });
    const userData = await User.findByPk(id);

    res.status(200).json({ userData });
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


