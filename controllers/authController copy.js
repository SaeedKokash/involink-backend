const createError = require('http-errors');
const logger = require('../config/logger');
const { User, RequestToPay } = require('../models');
const { signToken, verifyToken } = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// // User login
// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       logger.warn('Login attempt with missing email or password');
//       return next(createError(400, 'Please provide email and password!'));
//     }

//     const user = await User.findOne({ email }).select('+password');
//     if (!user || !(await user.correctPassword(password, user.password))) {
//       logger.warn(`Login attempt with invalid credentials: ${email}`);
//       return next(createError(401, 'Incorrect email or password'));
//     }

//     const accessToken = signToken(user._id, user.role, process.env.JWT_SECRET, '15m');
//     const refreshToken = signToken(user._id, user.role, process.env.JWT_REFRESH_SECRET, '7d');
//     logger.info(`User ${user._id} logged in successfully`);

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });


//     res.status(200).json({ status: 'success', accessToken });
//   } catch (err) {
//     next(err);
//   }
// };

// // User signup
// exports.signup = async (req, res, next) => {
//   const { name, email, password, role } = req.body;

//   try {
//     if (!name || !email || !password) {
//       logger.warn('Signup attempt with missing name, email or password');
//       return next(createError(400, 'Please provide name, email and password!'));
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//     });

//     const accessToken = signToken(user._id, user.role, process.env.JWT_SECRET, '15m');
//     const refreshToken = signToken(user._id, user.role, process.env.JWT_REFRESH_SECRET, '7d');
//     logger.info(`User ${user._id} signed up successfully`);

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(201).json({ status: 'success', accessToken });
//   } catch (err) {
//     next(err);
//   }
// }

// // Refresh access token
// exports.refreshToken = async (req, res, next) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//       logger.warn('Refresh token not provided in refresh request');
//       return next(createError(401, 'Refresh token is required!'));
//     }

//     const decoded = await verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

//     const newAccessToken = signToken(decoded.id, decoded.role, process.env.JWT_SECRET, '15m');
//     const newRefreshToken = signToken(decoded.id, decoded.role, process.env.JWT_REFRESH_SECRET, '7d');

//     logger.info(`User ${decoded.id} refreshed token successfully`);

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({
//       status: 'success',
//       accessToken: newAccessToken,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.logout = async (req, res) => {
//   res.clearCookie('refreshToken');
//   return res.status(200).json({ message: 'Logged out successfully' });
// };


// new
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    console.log(req.body)

    const user = await User.create({ name, email, password, role });

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
    res.clearCookie('refreshToken');
    logger.info(`User logged out: ${req.user.email}`);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error(`Error logging out user: ${error.message}`);
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    logger.info(`Access token refreshed for user: ${user.id}`);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error(`Error refreshing token: ${error.message}`);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

exports.getRTPData = async (req, res, next) => {
  try {
    const rtpData = await RequestToPay.findAll();

    res.status(200).json({ rtpData });
  } catch (error) {
    logger.error(`Error fetching RTP data: ${error.message}`);
    next(error);
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const userData = await User.findAll();

    res.status(200).json({ userData });
  } catch (error) {
    logger.error(`Error fetching RTP data: ${error.message}`);
    next(error);
  }
}
