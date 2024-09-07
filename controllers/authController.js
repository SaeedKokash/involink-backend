const createError = require('http-errors');
const logger = require('../config/logger');
const { User, RequestToPay, RefreshToken } = require('../models');
const { signAccessToken, signRefreshToken } = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, role });

    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict', // CSRF protection for cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({ accessToken });
  } catch (error) {
    console.log(error)
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

    res.status(200).json({ accessToken });
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

exports.getAllUsers = async (req, res, next) => {
  try {
    const userData = await User.findAll();

    res.status(200).json({ userData });
  } catch (error) {
    logger.error(`Error fetching RTP data: ${error.message}`);
    next(error);
  }
}


exports.getRTPData = async (req, res, next) => {
  try {
    const rtpData = await RequestToPay.findAll();

    res.status(200).json({ rtpData });
  } catch (error) {
    logger.error(`Error fetching RTP data: ${error.message}`);
    next(error);
  }
}

