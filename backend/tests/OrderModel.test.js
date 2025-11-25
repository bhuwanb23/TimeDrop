const { Order } = require('../src/models');
const { sequelize } = require('../src/models');

describe('Order Model', () => {
  beforeAll(async () => {
    // Sync the database before running tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await sequelize.close();
  });

  describe('Order Validation', () => {
    it('should create a valid order', async () => {
      const orderData = {
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867,
        status: 'Pending Slot Selection'
      };

      const order = await Order.create(orderData);
      
      expect(order.order_id).toBe(orderData.order_id);
      expect(order.customer_name).toBe(orderData.customer_name);
      expect(order.phone).toBe(orderData.phone);
      expect(order.status).toBe(orderData.status);
    });

    it('should enforce unique order_id constraint', async () => {
      const orderData = {
        order_id: 'TEST-002',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867
      };

      // Create the first order
      await Order.create(orderData);
      
      // Try to create another order with the same order_id
      await expect(Order.create(orderData)).rejects.toThrow();
    });

    it('should validate required fields', async () => {
      const orderData = {
        // Missing required fields
        customer_name: 'Test Customer'
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    it('should validate phone number format', async () => {
      const orderData = {
        order_id: 'TEST-003',
        customer_name: 'Test Customer',
        phone: 'invalid-phone',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    it('should validate pincode format', async () => {
      const orderData = {
        order_id: 'TEST-004',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: 'invalid-pincode',
        lat: 17.3850,
        lng: 78.4867
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    it('should set default status if not provided', async () => {
      const orderData = {
        order_id: 'TEST-005',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867
        // No status provided
      };

      const order = await Order.create(orderData);
      expect(order.status).toBe('Pending Slot Selection');
    });
  });

  describe('Order Status Transitions', () => {
    it('should allow valid status transitions', async () => {
      const orderData = {
        order_id: 'TEST-006',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867,
        status: 'Pending Slot Selection'
      };

      const order = await Order.create(orderData);
      
      // Update status to a valid next status
      order.status = 'Slot Selected';
      const updatedOrder = await order.save();
      
      expect(updatedOrder.status).toBe('Slot Selected');
    });
  });
});