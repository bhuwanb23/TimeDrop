const { Order, Driver } = require('../models');
const { Op } = require('sequelize');
const { groupAndAssignDeliveries } = require('../utils/deliveryGrouping');
const { validateStatusTransition, logStatusChange, sendStatusNotification } = require('../utils/statusManagement');
const { sendCourierCallback } = require('../utils/courierIntegration');

const SLOT_BASE_URL = process.env.SLOT_SELECTION_BASE_URL || 'https://delivery-app.example.com/slots';

const buildSlotLink = (orderId) => `${SLOT_BASE_URL}/${orderId}`;

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
      data: newOrder,
      slot_link: buildSlotLink(order_id)
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

// PUT /api/orders/:id/assign-driver - Assign driver manually
const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driver_id } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const driver = await Driver.findByPk(driver_id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    if (!['Slot Selected', 'Rescheduled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order is not ready for driver assignment'
      });
    }

    order.assigned_driver_id = driver_id;
    order.status = 'Assigned to Driver';
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: order
    });
  } catch (error) {
    console.error('Error assigning driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/orders/auto-assign - Auto assign drivers using grouping logic
const autoAssignDrivers = async (req, res) => {
  try {
    const pendingOrders = await Order.findAll({
      where: {
        status: 'Slot Selected',
        assigned_driver_id: { [Op.is]: null }
      }
    });

    if (pendingOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No orders waiting for assignment',
        assigned: 0
      });
    }

    const groupingResult = await groupAndAssignDeliveries(pendingOrders);

    if (!groupingResult.success) {
      return res.status(500).json({
        success: false,
        message: groupingResult.error || 'Unable to assign drivers'
      });
    }

    let assignedCount = 0;
    const updatePromises = [];

    Object.values(groupingResult.groups).forEach((group) => {
      group.orders.forEach((orderData) => {
        if (orderData.assigned_driver_id) {
          assignedCount += 1;
          updatePromises.push(
            Order.update(
              {
                assigned_driver_id: orderData.assigned_driver_id,
                status: 'Assigned to Driver'
              },
              { where: { id: orderData.id } }
            )
          );
        }
      });
    });

    await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: `Assigned ${assignedCount} orders to drivers`,
      assigned: assignedCount,
      groups: groupingResult.groups
    });
  } catch (error) {
    console.error('Error auto assigning drivers:', error);
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

    // Validate status transition
    const oldStatus = order.status;
    if (!validateStatusTransition(oldStatus, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${oldStatus} to ${status}`
      });
    }

    order.status = status;
    await order.save();
    
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
  updateOrderStatus,
  assignDriver,
  autoAssignDrivers
};
};