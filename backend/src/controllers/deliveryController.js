const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const User = require('../models/User');

const getAllDeliveries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, driverId, sortBy = 'createdAt', sortOrder = 'ASC' } = req.query;
    
    // Build where clause for filtering
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (driverId) {
      whereClause.driver_id = driverId;
    }
    
    // For drivers, only show their own deliveries
    if (req.user.role === 'driver') {
      whereClause.driver_id = req.user.id;
    }
    
    // Fetch deliveries with pagination
    const deliveries = await Delivery.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount', 'status'],
          include: [{
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          }]
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'phone']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder]]
    });
    
    const totalPages = Math.ceil(deliveries.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      message: 'Deliveries retrieved successfully',
      data: {
        deliveries: deliveries.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalDeliveries: deliveries.count,
          hasNextPage,
          hasPrevPage,
          pageSize: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ error: 'Failed to retrieve deliveries' });
  }
};

const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount', 'status'],
          include: [{
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone', 'email']
          }]
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ]
    });
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.status(200).json({
      message: 'Delivery retrieved successfully',
      data: delivery
    });
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({ error: 'Failed to retrieve delivery' });
  }
};

const assignDelivery = async (req, res) => {
  try {
    const { orderId, driverId } = req.body;
    
    // Verify the order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Verify the driver exists
    const driver = await User.findByPk(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ error: 'Driver not found or invalid role' });
    }
    
    // Check if delivery already exists for this order
    let delivery = await Delivery.findOne({ where: { order_id: orderId } });
    
    if (delivery) {
      // Update existing delivery
      await delivery.update({ 
        driver_id: driverId,
        status: 'assigned'
      });
    } else {
      // Create new delivery assignment
      delivery = await Delivery.create({
        order_id: orderId,
        driver_id: driverId,
        status: 'assigned',
        dropoff_location: order.delivery_address
      });
    }
    
    // Update order status
    await order.update({ 
      status: 'assigned',
      delivery_person_id: driverId
    });
    
    // Fetch the updated delivery with associations
    const updatedDelivery = await Delivery.findByPk(delivery.id, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount', 'status'],
          include: [{
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone', 'email']
          }]
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ]
    });
    
    res.status(200).json({
      message: 'Delivery assigned successfully',
      data: updatedDelivery
    });
  } catch (error) {
    console.error('Assign delivery error:', error);
    res.status(500).json({ error: 'Failed to assign delivery' });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_pickup_time, actual_delivery_time, delivery_proof, signature } = req.body;
    
    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    // Update delivery status and other fields
    await delivery.update({
      status,
      actual_pickup_time,
      actual_delivery_time,
      delivery_proof,
      signature
    });
    
    // If delivery is marked as delivered, update the order status too
    if (status === 'delivered') {
      const order = await Order.findByPk(delivery.order_id);
      if (order) {
        await order.update({ 
          status: 'delivered',
          actual_delivery_time: actual_delivery_time || new Date()
        });
      }
    }
    
    // Fetch the updated delivery
    const updatedDelivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount', 'status'],
          include: [{
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone', 'email']
          }]
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ]
    });
    
    res.status(200).json({
      message: 'Delivery status updated successfully',
      data: updatedDelivery
    });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

module.exports = {
  getAllDeliveries,
  getDeliveryById,
  assignDelivery,
  updateDeliveryStatus
};