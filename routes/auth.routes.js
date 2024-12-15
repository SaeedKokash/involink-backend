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
// const { checkPermission } = require('../middleware/permissionMiddleware');

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", authenticate, logout);
router.post("/refresh-token", refreshToken);
router.get("/verify-email", verifyEmail);

// // Example of an authenticated route
// router.get('/profile', isAuthenticated, (req, res) => {
//     return res.json({ message: 'This is a protected route', user: req.user });
//   });

//   // Example of a permission-based route
//   router.get('/manage-users', isAuthenticated, checkPermission('manage_users'), (req, res) => {
//     return res.json({ message: 'This route is accessible only by users with the "manage_users" permission' });
//   });

module.exports = router;
