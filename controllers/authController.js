"use strict";

require("dotenv").config();
const logger = require("../config/logger");
const { User, RefreshToken, Role } = require("../models");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
} = require("../utils/tokenUtils");
const { sendVerificationEmail } = require("../services/emailService");
const crypto = require("crypto");

/**
 * User signup controller.
 * Creates a new user, assigns the 'Customer' role, and generates tokens.
 * Returns user data with roles and tokens.
 */
exports.signup = async (req, res, next) => {
  const transaction = await User.sequelize.transaction(); // Start a transaction
  try {
    const {
      name,
      email,
      phone_number,
      password,
      remember_token,
      last_logged_in_at,
      locale,
      landing_page,
      enabled,
    } = req.body;

    // Check if user with the same email exists
    const isEmailExists = await User.findOne({ where: { email }, transaction });
    if (isEmailExists) {
      await transaction.rollback();
      return next({ statusCode: 400, message: "Email already exists" });
    }

    // Check if user with the same phone number exists
    const isPhoneNumberExists = await User.findOne({
      where: { phone_number },
      transaction,
    });
    if (isPhoneNumberExists) {
      await transaction.rollback();
      return next({ statusCode: 400, message: "Phone number already exists" });
    }

    // Create the user within the transaction
    const user = await User.create(
      {
        name,
        email,
        phone_number,
        password,
        remember_token: remember_token || null,
        last_logged_in_at: last_logged_in_at || null,
        locale: locale || "en",
        landing_page: landing_page || "/customer",
        enabled: enabled || false,
      },
      { transaction }
    );

    // Log the user.id to verify it's correctly set
    console.log(`User created with ID: ${user.id}`);

    // Assign 'Customer' role to the created user
    const role = await Role.findOne({
      where: { name: "Customer" },
      transaction,
    });
    if (role) {
      await user.addRole(role, { transaction });
      console.log("Role assigned to user");
    } else {
      await transaction.rollback();
      logger.error(`Role not found, user ${user.email} not assigned a role`);
      return next({ statusCode: 500, message: "Role not found" });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

    // Update user with verification token and expiry
    await user.update(
      {
        email_verification_token: verificationToken,
        email_verification_token_expiry: tokenExpiry,
      },
      { transaction }
    );

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Fetch user with roles within the transaction
    const userWithRoles = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: "Roles",
          through: { attributes: [] }, // Exclude pivot table data
          attributes: ["name"], // Include only role name
        },
      ],
      transaction,
    });

    // Create Refresh Token within the transaction
    const refreshToken = await signRefreshToken(userWithRoles, transaction);

    // Commit the transaction after all operations succeed
    await transaction.commit();

    // Sign Access Token with user roles
    const accessToken = signAccessToken(userWithRoles);

    // Set the refresh token as a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // Adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`User registered: ${user.email}`);

    // Extract role names
    const roleNames = userWithRoles.Roles.map((role) => role.name);

    // Send the response
    res.status(201).json({
      accessToken,
      user: {
        id: userWithRoles.id,
        name: userWithRoles.name,
        email: userWithRoles.email,
        phone: userWithRoles.phone_number,
        remember_token: userWithRoles.remember_token,
        last_logged_in_at: userWithRoles.last_logged_in_at,
        locale: userWithRoles.locale,
        landing_page: userWithRoles.landing_page,
        roles: roleNames, // Include role names
      },
    });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    logger.error(`Error registering user: ${error.message}`);
    next(error);
  }
};

/**
 * User login controller.
 * Authenticates the user, generates tokens, and returns user data with roles.
 */
exports.login = async (req, res, next) => {
  const transaction = await User.sequelize.transaction(); // Start a transaction
  try {
    const { email, password } = req.body;

    // Find user with roles within the transaction
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "Roles",
          through: { attributes: [] }, // Exclude pivot table data
          attributes: ["name"], // Include only role name
        },
      ],
      transaction,
    });

    if (!user || !(await user.isValidPassword(password))) {
      await transaction.rollback();
      return next({ statusCode: 400, message: "Invalid email or password" });
    }

    // Check if the user's email is verified
    if (!user.email_verified) {
      await transaction.rollback();
      return next({
        statusCode: 403,
        message: "Please verify your email before logging in.",
      });
    }

    // Cleanup old refresh tokens for this user within the transaction
    await RefreshToken.destroy({ where: { user_id: user.id }, transaction });

    // Sign Refresh Token within the transaction
    const refreshToken = await signRefreshToken(user, transaction);

    // Sign Access Token (doesn't require transaction)
    const accessToken = signAccessToken(user);

    // Commit the transaction after all operations succeed
    await transaction.commit();

    // Set the refresh token as a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // Adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`User logged in: ${user.email}`);

    // Send the response
    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_number, // Corrected field name
        remember_token: user.remember_token,
        last_logged_in_at: user.last_logged_in_at,
        locale: user.locale,
        landing_page: user.landing_page,
        roles: user.Roles.map((role) => role.name), // Include role names
      },
    });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    logger.error(`Error logging in user: ${error.message}`);
    next(error);
  }
};

/**
 * User logout controller.
 * Invalidates the refresh token and clears the cookie.
 */
exports.logout = async (req, res, next) => {
  const transaction = await RefreshToken.sequelize.transaction(); // Start a transaction
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // Invalidate refresh token within the transaction
      await RefreshToken.destroy({ where: { token }, transaction });
      res.clearCookie("refreshToken"); // Clear the refresh token cookie
      logger.info(`Refresh token invalidated for user: ${req.user.email}`);
    }

    // Commit the transaction after operations
    await transaction.commit();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    logger.error(`Error logging out user: ${error.message}`);
    next(error);
  }
};

/**
 * Refresh Token controller.
 * Generates new access and refresh tokens upon valid refresh token request.
 */
exports.refreshToken = async (req, res, next) => {
  const transaction = await User.sequelize.transaction(); // Start a transaction
  try {
    const token = req.cookies.refreshToken; // Get refresh token from HTTP-only cookie

    if (!token) {
      await transaction.rollback();
      return next({ statusCode: 403, message: "Refresh token not found" });
    }

    // Verify the refresh token exists in the database within the transaction
    const existingToken = await RefreshToken.findOne({
      where: { token },
      transaction,
    });

    if (!existingToken) {
      await transaction.rollback();
      return next({ statusCode: 403, message: "Invalid refresh token" });
    }

    // Check if the token is expired
    if (RefreshToken.isExpired(existingToken)) {
      await RefreshToken.destroy({ where: { token }, transaction }); // Cleanup expired token
      await transaction.commit(); // Commit the destroy
      return next({ statusCode: 403, message: "Refresh token expired" });
    }

    // Verify the JWT refresh token
    const decoded = await verifyToken(token, process.env.JWT_REFRESH_SECRET);

    // Fetch the user with roles within the transaction
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: "Roles",
          through: { attributes: [] }, // Exclude pivot table data
          attributes: ["name"], // Include only role name
        },
      ],
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return next({ statusCode: 404, message: "User not found" });
    }

    // Sign new tokens within the transaction
    const newAccessToken = signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user, transaction);

    // Invalidate the old refresh token
    await RefreshToken.destroy({ where: { token }, transaction });

    // Commit the transaction after all operations succeed
    await transaction.commit();

    // Set the new refresh token as a cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`Refresh token used and replaced for user: ${user.id}`);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    logger.error(`Error refreshing token: ${error.message}`);
    next(error);
  }
};

/**
 * Email verification controller.
 * Verifies the user's email using the token.
 */
exports.verifyEmail = async (req, res, next) => {
  const transaction = await User.sequelize.transaction(); // Start a transaction
  try {
    const { token } = req.query;

    if (!token) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Verification token is missing." });
    }

    // Find the user with the provided verification token within the transaction
    const user = await User.findOne({
      where: { email_verification_token: token },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // Check if the token has expired
    if (user.email_verification_token_expiry < new Date()) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Verification token has expired." });
    }

    // Update the user's email verification status
    await user.update(
      {
        email_verified: true,
        email_verification_token: null,
        email_verification_token_expiry: null,
      },
      { transaction }
    );

    // Commit the transaction after successful verification
    await transaction.commit();

    logger.info(`User email verified: ${user.email}`);

    // Redirect to a success page or send a success response
    res.status(200).json({ message: "Email verified successfully." });
    // Alternatively, redirect:
    // res.redirect('/email-verified-success'); // Replace with your success page URL
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    logger.error(`Error verifying email: ${error.message}`);
    next(error);
  }
};
