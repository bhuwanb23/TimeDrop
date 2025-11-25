const request = require('supertest');
const express = require('express');
const { Order } = require('../src/models');
const ordersRoutes = require('../src/routes/ordersRoutes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/orders', ordersRoutes);

// Mock the database
jest.mock('../src/models', () => {
  const actualModels = jest.requireActual('../src/models');
  return {
    ...actualModels,
    Order: {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn()
    },
    Driver: {
      findAll: jest.fn()
    }
  };
});

// Mock delivery grouping utility
jest.mock('../src/utils/deliveryGrouping', () => ({
  groupAndAssignDeliveries: jest.fn().mockResolvedValue({
    success: true,
    groups: {}
  })
}));

// Mock status management utility
jest.mock('../src/utils/statusManagement', () => ({
  validateStatusTransition: jest.fn().mockReturnValue(true),
  logStatusChange: jest.fn(),
  sendStatusNotification: jest.fn()
}));

// Mock courier integration utility
jest.mock('../src/utils/courierIntegration', () => ({
  sendCourierCallback: jest.fn().mockResolvedValue({
    success: true
  })
}));

describe('Orders Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders/new', () => {
    it('should create a new order successfully', async () => {
      const mockOrder = {
        id: 1,
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867,
        status: 'Pending Slot Selection'
      };

      Order.create.mockResolvedValue(mockOrder);
      // Mock Driver.findAll for delivery grouping
      const { Driver } = require('../src/models');
      Driver.findAll.mockResolvedValue([]);

      const response = await request(app)
        .post('/api/orders/new')
        .send({
          order_id: 'TEST-001',
          customer_name: 'Test Customer',
          phone: '9876543210',
          address: 'Test Address',
          pincode: '500001',
          lat: 17.3850,
          lng: 78.4867
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Order created successfully');
      expect(Order.create).toHaveBeenCalledTimes(1);
    });

    it('should return 409 if order already exists', async () => {
      Order.findOne.mockResolvedValue({ id: 1, order_id: 'TEST-001' });
      // Mock Driver.findAll for delivery grouping
      const { Driver } = require('../src/models');
      Driver.findAll.mockResolvedValue([]);

      const response = await request(app)
        .post('/api/orders/new')
        .send({
          order_id: 'TEST-001',
          customer_name: 'Test Customer',
          phone: '9876543210',
          address: 'Test Address',
          pincode: '500001',
          lat: 17.3850,
          lng: 78.4867
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order already exists');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order details when order exists', async () => {
      const mockOrder = {
        id: 1,
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867,
        status: 'Pending Slot Selection'
      };

      Order.findByPk.mockResolvedValue(mockOrder);
      // Mock Driver.findAll for delivery grouping (in case it's needed)
      const { Driver } = require('../src/models');
      Driver.findAll.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/orders/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(Order.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 when order does not exist', async () => {
      Order.findByPk.mockResolvedValue(null);
      // Mock Driver.findAll for delivery grouping (in case it's needed)
      const { Driver } = require('../src/models');
      Driver.findAll.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/orders/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });
  });

  describe('PUT /api/orders/:id/select-slot', () => {
    it('should update order slot successfully', async () => {
      const mockOrder = {
        id: 1,
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867,
        status: 'Slot Selected',
        slot_date: '2025-02-15',
        slot_time: '10AM - 12PM',
        save: jest.fn().mockResolvedValue()
      };

      Order.findByPk.mockResolvedValue(mockOrder);
      // Mock Order.findAll for delivery grouping
      Order.findAll.mockResolvedValue([mockOrder]);
      // Mock Driver.findAll for delivery grouping
      const { Driver } = require('../src/models');
      Driver.findAll.mockResolvedValue([]);

      const response = await request(app)
        .put('/api/orders/1/select-slot')
        .send({
          slot_date: '2025-02-15',
          slot_time: '10AM - 12PM'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Slot selected successfully');
      expect(mockOrder.save).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when order does not exist for slot selection', async () => {
      Order.findByPk.mockResolvedValue(null);
      // Mock Order.findAll for delivery grouping
      Order.findAll.mockResolvedValue([]);
      // Mock Driver.findAll for delivery grouping
      const { Driver } = require('../src/models');
      Driver.findAll.mockResolvedValue([]);

      const response = await request(app)
        .put('/api/orders/999/select-slot')
        .send({
          slot_date: '2025-02-15',
          slot_time: '10AM - 12PM'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });
  });
});