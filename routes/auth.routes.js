const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  signup,
  login,
  logout,
  refreshToken,
  verifyEmail,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  validateSignup,
  validateLogin,
} = require("../validators/authValidation");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", authenticate, logout);
router.post("/refresh-token", refreshToken);
router.get("/verify-email", verifyEmail);

module.exports = router;
