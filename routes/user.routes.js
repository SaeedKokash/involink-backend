const express = require('express');
const userController = require('../controllers/userController');
const { checkRole, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

// Admin-only route to fetch all users
router.get('/', checkRole('Admin'), userController.getUsers);

// Get a user by ID (accessible to admin or the user themselves)
router.get('/:id', checkPermission('view_user'), userController.getUserById);

// Update a user (accessible to admin or the user themselves)
router.put('/:id', checkPermission('update_user'), userController.updateUser);

// Delete a user (admin-only route)
router.delete('/:id', checkRole('Admin'), userController.deleteUser);

// Restore a user (admin-only route)
router.post('/:id', checkRole('Admin'), userController.restoreUser);

module.exports = router;