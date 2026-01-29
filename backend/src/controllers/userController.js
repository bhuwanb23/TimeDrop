const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, sortBy = 'createdAt', sortOrder = 'ASC' } = req.query;
    
    // Build where clause for filtering
    let whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    // Fetch users with pagination
    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] }, // Don't return passwords
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder]]
    });
    
    const totalPages = Math.ceil(users.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      message: 'Users retrieved successfully',
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
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } // Don't return password
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status, profile_image } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken by another user' });
      }
    }
    
    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      role: role || user.role,
      status: status || user.status,
      profile_image: profile_image || user.profile_image
    });
    
    // Return updated user
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // For soft delete, we'll update the status to 'inactive'
    await user.update({ status: 'inactive' });
    
    res.status(200).json({
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Current user profile retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Get current user profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve current user profile' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUserProfile
};