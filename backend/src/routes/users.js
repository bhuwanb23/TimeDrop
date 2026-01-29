const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, getCurrentUserProfile } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes (accessible to authenticated users)
router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/profile', authenticateToken, getCurrentUserProfile);

// Protected routes - only for admin
router.get('/:id', authenticateToken, authorizeRoles('admin'), getUserById);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

module.exports = router;