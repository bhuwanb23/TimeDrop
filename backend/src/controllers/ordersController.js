const { Order } = require('../models');
const { groupAndAssignDeliveries } = require('../utils/deliveryGrouping');
const { validateStatusTransition, logStatusChange, sendStatusNotification } = require('../utils/statusManagement');
const { sendCourierCallback } = require('../utils/courierIntegration');

// POST /api/orders/new - Receive new order from courier
const createOrder = async (req, res) => {
  try {
    const {
      order_id,
      customer_name,
      phone,
      address,
      pincode,
      lat,
      lng
    } = req.body;

      // All validation is now handled by middleware

    // Check if order already exists
    const existingOrder = await Order.findOne({ where: { order_id } });
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: 'Order already exists'
      });
    }

    // Create new order with "Pending Slot Selection" status
    const newOrder = await Order.create({
      order_id,
      customer_name,
      phone,
      address,
      pincode,
      lat,
      lng,
      status: 'Pending Slot Selection'
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/orders/:id - View order details
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve order by ID
    const order = await Order.findByPk(id);

    // Handle case when order doesn't exist
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Return formatted order data
    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error retrieving order:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /api/orders/select-slot - Customer selects delivery slot
const selectSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { slot_date, slot_time } = req.body;

      // All validation is now handled by middleware

    // Retrieve order by ID
    const order = await Order.findByPk(id);

    // Handle case when order doesn't exist
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order with selected slot
    order.slot_date = slot_date;
    order.slot_time = slot_time;
    order.status = 'Slot Selected';
    await order.save();

    // Trigger delivery grouping logic
    const allOrders = await Order.findAll({
      where: {
        status: 'Slot Selected'
      }
    });
    
    const groupingResult = await groupAndAssignDeliveries(allOrders);
    console.log('Delivery grouping result:', groupingResult);
    
    // Update assigned orders in database
    if (groupingResult.success) {
      for (const [pincode, group] of Object.entries(groupingResult.groups)) {
        for (const orderData of group.orders) {
          if (orderData.assigned_driver_id) {
            await Order.update(
              { assigned_driver_id: orderData.assigned_driver_id },
              { where: { id: orderData.id } }
            );
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Slot selected successfully',
      data: order
    });
  } catch (error) {
    console.error('Error selecting slot:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /api/orders/update-status - Driver updates delivery status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

      // All validation is now handled by middleware

    // Retrieve order by ID
    const order = await Order.findByPk(id);

    // Handle case when order doesn't exist
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status in database
    order.status = status;
    await order.save();

    // Validate status transition
    const oldStatus = order.status;
    if (!validateStatusTransition(oldStatus, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${oldStatus} to ${status}`
      });
    }
    
    // Log status change
    logStatusChange(order.id, oldStatus, status);
    
    // Send notification
    sendStatusNotification(order, oldStatus, status);
    
    // Notify courier system via callback
    await sendCourierCallback(order, status);

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  selectSlot,
  updateOrderStatus
};