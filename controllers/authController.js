'use strict';

const logger = require('../config/logger');
const { User, RefreshToken, Role, UserRole } = require('../models');
const { signAccessToken, signRefreshToken } = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email }, paranoid: false });
    if (existingUser) {
      return next({ statusCode: 400, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, enabled: true, locale: 'en' });

    // Assign 'merchant' role
    const role = await Role.findOne({ where: { name: 'merchant' } });
    if (role) {
      await UserRole.create({
        user_id: user.id,
        role_id: role.id,
        user_type: 'User',
      });
    } else {
      logger.error('Role not found');
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict', // CSRF protection for cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({ accessToken, user });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict', // CSRF protection for cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({ accessToken, user });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await RefreshToken.destroy({ where: { token } }); // Invalidate refresh token
      res.clearCookie('refreshToken'); // Clear the refresh token cookie
    }
    
      logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error(`Error logging out user: ${error.message}`);
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken; // Get refresh token from HTTP-only cookie

    if (!token) {
      return res.status(403).json({ message: 'Refresh token not found' });
    }

    // Verify the refresh token
    const existingToken = await RefreshToken.findOne({ where: { token } });

    if (!existingToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Check if the token is expired
    if (RefreshToken.isExpired(existingToken)) {
      await RefreshToken.destroy({ where: { token } });
      return res.status(403).json({ message: 'Refresh token expired' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate a new access token
    const user = await User.findByPk(decoded.id);
    const newAccessToken = signAccessToken(user);

    logger.info(`Access token refreshed for user: ${user.id}`);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error(`Error refreshing token: ${error.message}`);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};



