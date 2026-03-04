const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryById, getProductsByCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes - anyone can view categories
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/:id/products', getProductsByCategory);

// Protected routes - only admins can modify categories
router.post('/', authenticateToken, authorizeRoles('admin'), createCategory);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteCategory);

module.exports = router;
