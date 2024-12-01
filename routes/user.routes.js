const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
// const { checkPermission } = require('../middleware/permissionMiddleware');
const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware.authorize('admin'), userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id', authMiddleware.authorize('admin'), userController.restoreUser);

module.exports = router;