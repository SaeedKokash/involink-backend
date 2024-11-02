const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const { validateSignup, validateLogin } = require("../validators/authValidation");
// const { checkPermission } = require('../middleware/permissionMiddleware');

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh-token", authController.refreshToken);

// // Example of an authenticated route
// router.get('/profile', isAuthenticated, (req, res) => {
//     return res.json({ message: 'This is a protected route', user: req.user });
//   });

//   // Example of a permission-based route
//   router.get('/manage-users', isAuthenticated, checkPermission('manage_users'), (req, res) => {
//     return res.json({ message: 'This route is accessible only by users with the "manage_users" permission' });
//   });

module.exports = router;
