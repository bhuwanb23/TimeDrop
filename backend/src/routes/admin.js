const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/adminAuth');

// Public routes
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Protected admin routes
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetails);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/assign', adminController.assignDriver);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Products
router.get('/products', adminController.getProducts);
router.get('/products/create', adminController.getCreateProduct);
router.post('/products', adminController.createProduct);
router.get('/products/:id/edit', adminController.getEditProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Categories
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Deliveries
router.get('/deliveries', adminController.getDeliveries);
router.get('/deliveries/:id', adminController.getDeliveryDetails);
router.put('/deliveries/:id/status', adminController.updateDeliveryStatus);

module.exports = router;
