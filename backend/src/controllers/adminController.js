const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Delivery = require('../models/Delivery');
const Category = require('../models/Category');
const { sequelize } = require('../config/database');

// ==========================================
// ADMIN LOGIN
// ==========================================

const getLogin = (req, res) => {
  res.render('admin/login', { title: 'Admin Login' });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/admin/login');
    }
    
    // Check if admin
    if (user.role !== 'admin') {
      req.flash('error_msg', 'Unauthorized access. Admin only.');
      return res.redirect('/admin/login');
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/admin/login');
    }
    
    // Set session
    req.session.adminUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error_msg', 'Login failed');
    res.redirect('/admin/login');
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

// ==========================================
// DASHBOARD
// ==========================================

const getDashboard = async (req, res) => {
  try {
    // Fetch statistics
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total_amount', { 
      where: { status: 'delivered' } 
    }) || 0;
    const activeDeliveries = await Delivery.count({ 
      where: { status: ['assigned', 'in_transit', 'picked_up'] } 
    });
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    
    // Recent orders
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ 
        model: User, 
        as: 'customer', 
        attributes: ['id', 'name', 'email'] 
      }]
    });
    
    // Order status breakdown
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['status']
    });
    
    // Monthly revenue (simplified for SQLite)
    const monthlyRevenue = await Order.findAll({
      attributes: [
        [sequelize.fn('strftime', '%Y-%m', sequelize.col('created_at')), 'month'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: { status: 'delivered' },
      group: [sequelize.fn('strftime', '%Y-%m', sequelize.col('created_at'))],
      order: [[sequelize.fn('strftime', '%Y-%m', sequelize.col('created_at')), 'ASC']],
      raw: true
    });
    
    res.render('admin/dashboard', {
      title: 'Dashboard',
      stats: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue),
        activeDeliveries,
        totalUsers,
        totalProducts
      },
      recentOrders,
      ordersByStatus,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error_msg', 'Failed to load dashboard');
    res.redirect('/admin/login');
  }
};

// ==========================================
// ORDERS MANAGEMENT
// ==========================================

const getOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { order_number: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [{ 
        model: User, 
        as: 'customer', 
        attributes: ['id', 'name', 'email', 'phone'] 
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.render('admin/orders/index', {
      title: 'Orders',
      orders,
      currentPage: parseInt(page),
      totalPages,
      totalOrders: count,
      currentStatus: status,
      searchQuery: search
    });
  } catch (error) {
    console.error('Get orders error:', error);
    req.flash('error_msg', 'Failed to load orders');
    res.redirect('/admin/dashboard');
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'customer', 
          attributes: ['id', 'name', 'email', 'phone'] 
        },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ 
            model: Product, 
            as: 'product',
            attributes: ['id', 'name', 'price', 'image_url'] 
          }]
        },
        {
          model: Delivery,
          as: 'delivery',
          include: [{
            model: User,
            as: 'driver',
            attributes: ['id', 'name', 'phone']
          }]
        }
      ]
    });
    
    if (!order) {
      req.flash('error_msg', 'Order not found');
      return res.redirect('/admin/orders');
    }
    
    // Get all drivers for assignment
    const drivers = await User.findAll({
      where: { role: 'driver', status: 'active' },
      attributes: ['id', 'name', 'email']
    });
    
    res.render('admin/orders/show', {
      title: `Order ${order.order_number}`,
      order,
      drivers
    });
  } catch (error) {
    console.error('Get order details error:', error);
    req.flash('error_msg', 'Failed to load order details');
    res.redirect('/admin/orders');
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      req.flash('error_msg', 'Order not found');
      return res.redirect('/admin/orders');
    }
    
    await order.update({ status });
    req.flash('success_msg', `Order status updated to ${status}`);
    res.redirect(`/admin/orders/${id}`);
  } catch (error) {
    console.error('Update order status error:', error);
    req.flash('error_msg', 'Failed to update order status');
    res.redirect(`/admin/orders/${req.params.id}`);
  }
};

const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driver_id } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      req.flash('error_msg', 'Order not found');
      return res.redirect('/admin/orders');
    }
    
    await order.update({ delivery_person_id: driver_id, status: 'assigned' });
    
    // Create or update delivery record
    let delivery = await Delivery.findOne({ where: { order_id: id } });
    if (delivery) {
      await delivery.update({ driver_id, status: 'assigned' });
    } else {
      await Delivery.create({
        order_id: id,
        driver_id,
        status: 'assigned',
        pickup_location: JSON.stringify({ street: 'Warehouse', city: 'Main', state: 'CA', zip_code: '00000', country: 'USA' }),
        dropoff_location: order.delivery_address
      });
    }
    
    req.flash('success_msg', 'Driver assigned successfully');
    res.redirect(`/admin/orders/${id}`);
  } catch (error) {
    console.error('Assign driver error:', error);
    req.flash('error_msg', 'Failed to assign driver');
    res.redirect(`/admin/orders/${req.params.id}`);
  }
};

// ==========================================
// USERS MANAGEMENT
// ==========================================

const getUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (role) whereClause.role = role;
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.render('admin/users/index', {
      title: 'Users',
      users,
      currentPage: parseInt(page),
      totalPages,
      totalUsers: count,
      currentRole: role,
      currentStatus: status,
      searchQuery: search
    });
  } catch (error) {
    console.error('Get users error:', error);
    req.flash('error_msg', 'Failed to load users');
    res.redirect('/admin/dashboard');
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/users');
    }
    
    res.render('admin/users/show', {
      title: `User: ${user.name}`,
      user
    });
  } catch (error) {
    console.error('Get user details error:', error);
    req.flash('error_msg', 'Failed to load user details');
    res.redirect('/admin/users');
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/users');
    }
    
    await user.update({ name, email, phone, role, status });
    req.flash('success_msg', 'User updated successfully');
    res.redirect(`/admin/users/${id}`);
  } catch (error) {
    console.error('Update user error:', error);
    req.flash('error_msg', 'Failed to update user');
    res.redirect(`/admin/users/${req.params.id}`);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/admin/users');
    }
    
    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      req.flash('error_msg', 'Cannot delete your own account');
      return res.redirect('/admin/users');
    }
    
    await user.destroy();
    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Delete user error:', error);
    req.flash('error_msg', 'Failed to delete user');
    res.redirect('/admin/users');
  }
};

// ==========================================
// PRODUCTS MANAGEMENT
// ==========================================

const getProducts = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (category) whereClause.category_id = category;
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [{ 
        model: Category, 
        as: 'category',
        attributes: ['id', 'name'] 
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const categories = await Category.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name']
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.render('admin/products/index', {
      title: 'Products',
      products,
      categories,
      currentPage: parseInt(page),
      totalPages,
      totalProducts: count,
      currentCategory: category,
      currentStatus: status,
      searchQuery: search
    });
  } catch (error) {
    console.error('Get products error:', error);
    req.flash('error_msg', 'Failed to load products');
    res.redirect('/admin/dashboard');
  }
};

const getCreateProduct = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { status: 'active' },
      order: [['name', 'ASC']]
    });
    
    res.render('admin/products/create', {
      title: 'Create Product',
      categories
    });
  } catch (error) {
    console.error('Get create product error:', error);
    req.flash('error_msg', 'Failed to load create product page');
    res.redirect('/admin/products');
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, stock_quantity, weight } = req.body;
    
    await Product.create({
      name,
      description,
      price: parseFloat(price),
      category_id: category_id || null,
      image_url,
      stock_quantity: parseInt(stock_quantity) || 0,
      weight: weight ? parseFloat(weight) : null,
      status: 'active'
    });
    
    req.flash('success_msg', 'Product created successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Create product error:', error);
    req.flash('error_msg', 'Failed to create product');
    res.redirect('/admin/products/create');
  }
};

const getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    const categories = await Category.findAll({
      where: { status: 'active' },
      order: [['name', 'ASC']]
    });
    
    res.render('admin/products/edit', {
      title: `Edit: ${product.name}`,
      product,
      categories
    });
  } catch (error) {
    console.error('Get edit product error:', error);
    req.flash('error_msg', 'Failed to load product');
    res.redirect('/admin/products');
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, stock_quantity, weight, status } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    await product.update({
      name,
      description,
      price: parseFloat(price),
      category_id: category_id || null,
      image_url,
      stock_quantity: parseInt(stock_quantity),
      weight: weight ? parseFloat(weight) : null,
      status
    });
    
    req.flash('success_msg', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update product error:', error);
    req.flash('error_msg', 'Failed to update product');
    res.redirect(`/admin/products/${req.params.id}/edit`);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    await product.destroy();
    req.flash('success_msg', 'Product deleted successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Delete product error:', error);
    req.flash('error_msg', 'Failed to delete product');
    res.redirect('/admin/products');
  }
};

// ==========================================
// CATEGORIES MANAGEMENT
// ==========================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      include: [{
        model: Product,
        as: 'products',
        attributes: []
      }],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('products.id')), 'product_count']
        ]
      },
      group: ['Category.id']
    });
    
    res.render('admin/categories/index', {
      title: 'Categories',
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    req.flash('error_msg', 'Failed to load categories');
    res.redirect('/admin/dashboard');
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    
    await Category.create({
      name,
      description,
      image_url,
      status: 'active'
    });
    
    req.flash('success_msg', 'Category created successfully');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Create category error:', error);
    req.flash('error_msg', 'Failed to create category');
    res.redirect('/admin/categories');
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, status } = req.body;
    
    const category = await Category.findByPk(id);
    if (!category) {
      req.flash('error_msg', 'Category not found');
      return res.redirect('/admin/categories');
    }
    
    await category.update({ name, description, image_url, status });
    req.flash('success_msg', 'Category updated successfully');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Update category error:', error);
    req.flash('error_msg', 'Failed to update category');
    res.redirect('/admin/categories');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    if (!category) {
      req.flash('error_msg', 'Category not found');
      return res.redirect('/admin/categories');
    }
    
    await category.destroy();
    req.flash('success_msg', 'Category deleted successfully');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Delete category error:', error);
    req.flash('error_msg', 'Failed to delete category');
    res.redirect('/admin/categories');
  }
};

// ==========================================
// DELIVERIES MANAGEMENT
// ==========================================

const getDeliveries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (status) whereClause.status = status;
    
    const { count, rows: deliveries } = await Delivery.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Order, 
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount']
        },
        { 
          model: User, 
          as: 'driver',
          attributes: ['id', 'name', 'phone'] 
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.render('admin/deliveries/index', {
      title: 'Deliveries',
      deliveries,
      currentPage: parseInt(page),
      totalPages,
      totalDeliveries: count,
      currentStatus: status
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    req.flash('error_msg', 'Failed to load deliveries');
    res.redirect('/admin/dashboard');
  }
};

const getDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const delivery = await Delivery.findByPk(id, {
      include: [
        { 
          model: Order, 
          as: 'order',
          include: [{ 
            model: User, 
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone'] 
          }]
        },
        { 
          model: User, 
          as: 'driver',
          attributes: ['id', 'name', 'email', 'phone'] 
        }
      ]
    });
    
    if (!delivery) {
      req.flash('error_msg', 'Delivery not found');
      return res.redirect('/admin/deliveries');
    }
    
    res.render('admin/deliveries/show', {
      title: `Delivery ${delivery.id}`,
      delivery
    });
  } catch (error) {
    console.error('Get delivery details error:', error);
    req.flash('error_msg', 'Failed to load delivery details');
    res.redirect('/admin/deliveries');
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      req.flash('error_msg', 'Delivery not found');
      return res.redirect('/admin/deliveries');
    }
    
    await delivery.update({ status });
    req.flash('success_msg', `Delivery status updated to ${status}`);
    res.redirect(`/admin/deliveries/${id}`);
  } catch (error) {
    console.error('Update delivery status error:', error);
    req.flash('error_msg', 'Failed to update delivery status');
    res.redirect(`/admin/deliveries/${req.params.id}`);
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getDashboard,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  assignDriver,
  getUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getProducts,
  getCreateProduct,
  createProduct,
  getEditProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getDeliveries,
  getDeliveryDetails,
  updateDeliveryStatus
};
