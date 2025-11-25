const { Order } = require('../models');

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

    // Validate required fields
    if (!order_id || !customer_name || !phone || !address || !pincode || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

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

    // Validate slot selection data
    if (!slot_date || !slot_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing slot date or time'
      });
    }

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

    // Trigger delivery grouping logic (to be implemented)
    // For now, we'll just log that it should be triggered
    console.log('Delivery grouping logic should be triggered here');

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

    // Validate status update request
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Missing status'
      });
    }

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

    // Notify courier system via callback (to be implemented)
    // For now, we'll just log that it should happen
    console.log('Courier system notification should be sent here');

    // Log status change in delivery history (to be implemented)
    // For now, we'll just log that it should happen
    console.log(`Order ${order.order_id} status changed to ${status}`);

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