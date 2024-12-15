'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const { User, RefreshToken, Role, UserRole } = require('../models');
const { signAccessToken, signRefreshToken } = require('../utils/tokenUtils');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, remember_token, last_logged_in_at, locale, landing_page, enabled } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email }, paranoid: false });
    if (existingUser) {
      return next({ statusCode: 400, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      remember_token: remember_token || null,
      last_logged_in_at: last_logged_in_at || null,
      locale: locale || "en",
      landing_page: landing_page || null,
      enabled: enabled || true,
    });

    // Assign 'customer' role to created users by default
    const role = await Role.findOne({ where: { name: 'Customer' } });
    if (role) {
      await UserRole.create({ user_id: user.id, role_id: role.id });
    } else {
      logger.error('Role not found');
    }

    // Fetch user with roles
    const userWithRoles = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          through: { attributes: [] }, // Exclude pivot table data
          attributes: ['name'], // Include only role name
        },
      ],
    });

    const accessToken = signAccessToken(userWithRoles);
    const refreshToken = await signRefreshToken(userWithRoles);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'Strict', // CSRF protection for cookies
      sameSite: 'None', // CSRF protection for cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({
      accessToken,
      user: {
        id: userWithRoles.id,
        name: userWithRoles.name,
        email: userWithRoles.email,
        phone: userWithRoles.phone,
        remember_token: userWithRoles.remember_token,
        last_logged_in_at: userWithRoles.last_logged_in_at,
        locale: userWithRoles.locale,
        landing_page: userWithRoles.landing_page,
        roles: userWithRoles.Roles.map(role => role.name), // Include role names
      },
    });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          through: { attributes: [] }, // Exclude pivot table data
          attributes: ['name'], // Include only role name
        },
      ],
    });

    if (!user || !(await user.isValidPassword(password))) {
      return next({ statusCode: 400, message: 'Invalid email or password' });
    }

    // Cleanup old refresh tokens for this user
    await RefreshToken.destroy({ where: { user_id: user.id } });

    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'Strict', // CSRF protection for cookies
      sameSite: 'None', // CSRF protection for cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        remember_token: user.remember_token,
        last_logged_in_at: user.last_logged_in_at,
        locale: user.locale,
        landing_page: user.landing_page,
        roles: user.Roles.map(role => role.name), // Include role names
      },
    });

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
      return next({ statusCode: 403, message: 'Refresh token not found' });
    }

    // Verify the refresh token exists in the database
    const existingToken = await RefreshToken.findOne({ where: { token } });

    if (!existingToken) {
      return next({ statusCode: 403, message: 'Invalid refresh token' });
    }

    // Check if the token is expired
    if (RefreshToken.isExpired(existingToken)) {
      await RefreshToken.destroy({ where: { token } }); // Cleanup expired token
      return next({ statusCode: 403, message: 'Refresh token expired' });
    }

    // Verify the JWT refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate a new access token
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['name'], // Include only role names
        },
      ],
    });

    if (!user) {
      return next({ statusCode: 404, message: 'User not found' });
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user);

    // Invalidate the old refresh token
    await RefreshToken.destroy({ where: { token } });

    // Send the new refresh token as an HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`Refresh token used and replaced for user: ${user.id}`);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error(`Error refreshing token: ${error.message}`);
    next(error);
  }
};



