const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getAllUsers, getUserById, updateUser, deleteUser, getCurrentUserProfile } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Helper function to filter users by role
const getUsersByRole = (role) => {
  return async (req, res) => {
    try {
      const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'ASC' } = req.query;
      
      // Build where clause for filtering
      let whereClause = { role };
      
      if (status) {
        whereClause.status = status;
      }
      
      // Fetch users with pagination
      const users = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [[sortBy, sortOrder]]
      });
      
      const totalPages = Math.ceil(users.count / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      res.status(200).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)}s retrieved successfully`,
        data: {
          users: users.rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalUsers: users.count,
            hasNextPage,
            hasPrevPage,
            pageSize: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error(`Get ${role}s error:`, error);
      res.status(500).json({ error: `Failed to retrieve ${role}s` });
    }
  };
};

const getDrivers = getUsersByRole('driver');
const getCustomers = getUsersByRole('customer');

const updateCurrentUserProfile = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated token
    const { name, phone, profile_image } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if email is provided and different from current
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: req.body.email } });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: 'Email already taken by another user' });
      }
    }
    
    // Update user profile (only allow updating certain fields)
    await user.update({
      name: name || user.name,
      phone: phone || user.phone,
      profile_image: profile_image || user.profile_image
    });
    
    // Return updated user
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update current user profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Public routes (accessible to authenticated users)
router.get('/profile', authenticateToken, getCurrentUserProfile);
router.put('/profile', authenticateToken, updateCurrentUserProfile);

// Role-specific routes
router.get('/drivers', authenticateToken, authorizeRoles('admin'), getDrivers);
router.get('/customers', authenticateToken, authorizeRoles('admin'), getCustomers);

// Admin-only routes
router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles('admin'), getUserById);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

module.exports = router;