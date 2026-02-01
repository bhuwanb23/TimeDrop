const { generateOrderNumber } = require('../utils/orderUtils');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const Product = require('../models/Product');

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    // Build where clause for filtering
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (customerId) {
      whereClause.customer_id = customerId;
    }
    
    // Fetch orders with pagination
    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder]]
    });
    
    const totalPages = Math.ceil(orders.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: {
        orders: orders.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: orders.count,
          hasNextPage,
          hasPrevPage,
          pageSize: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

const getOrderById = async (req, res) => {
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
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.status(200).json({
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, delivery_address, delivery_notes, payment_method, delivery_time } = req.body;
    // For guest orders, we'll create a temporary identifier or assign to a default guest user
    // In a real implementation, you might want to create a temporary user or handle differently
    const userId = req.user ? req.user.id : null; // Will be null for guest orders
    
    // For guest orders, we'll use a special guest identifier
    const isGuestOrder = !req.user;
    
    // If this is a guest order, we can still process it
    if (isGuestOrder) {
      console.log('Processing guest order');
      // We'll assign guest orders to a default customer or handle differently
      // For this implementation, we'll create a basic order without customer association
    }
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }
    
    if (!delivery_address) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }
    
    // Generate unique order number
    const orderNumber = generateOrderNumber();
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.product_id} not found` });
      }
      
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
      }
      
      totalAmount += parseFloat(product.price) * item.quantity;
    }
    
    // Create order transaction
    // For guest orders, we'll use a default guest customer ID
    // In a production environment, you might want to create temporary guest users
    // For this local implementation, we'll use the existing guest user ID
    const finalCustomerId = isGuestOrder ? 4 : userId; // Using guest user ID 4 for guest orders
    
    const order = await Order.create({
      order_number: orderNumber,
      customer_id: finalCustomerId, // Use the determined customer ID
      total_amount: totalAmount,
      delivery_address,
      delivery_notes,
      payment_method,
      delivery_time,
      status: 'pending', // Initial status
      is_guest_order: isGuestOrder
    });
    
    // Create order items
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: parseFloat(product.price) * item.quantity,
        notes: item.notes
      });
      
      // Update product stock
      await product.update({
        stock_quantity: product.stock_quantity - item.quantity
      });
    }
    
    // Fetch the complete order with items
    const completeOrder = await Order.findByPk(order.id, {
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
        }
      ]
    });
    
    res.status(201).json({
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update order status
    await order.update({ status });
    
    res.status(200).json({
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};