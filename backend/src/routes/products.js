const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes - only admins and certain roles can modify products
router.post('/', authenticateToken, authorizeRoles('admin'), createProduct);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteProduct);

module.exports = router;