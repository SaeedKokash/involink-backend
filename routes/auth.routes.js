const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
// const { checkPermission } = require('../middleware/permissionMiddleware');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout',authMiddleware.authenticate, authController.logout);
router.post('/refresh-token', authController.refreshToken);



// // Example of an authenticated route
// router.get('/profile', isAuthenticated, (req, res) => {
//     return res.json({ message: 'This is a protected route', user: req.user });
//   });
  
//   // Example of a permission-based route
//   router.get('/manage-users', isAuthenticated, checkPermission('manage_users'), (req, res) => {
//     return res.json({ message: 'This route is accessible only by users with the "manage_users" permission' });
//   });

module.exports = router;
