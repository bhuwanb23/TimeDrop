const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Driver, Order } = require('../src/models');
const driversRoutes = require('../src/routes/driversRoutes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/drivers', driversRoutes);

// Mock the database
jest.mock('../src/models', () => {
  const actualModels = jest.requireActual('../src/models');
  return {
    ...actualModels,
    Driver: {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn()
    },
    Order: {
      findByPk: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn()
    }
  };
});

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

// Mock courier integration utilities
jest.mock('../src/utils/courierIntegration', () => ({
  sendCourierCallback: jest.fn().mockResolvedValue({
    success: true,
    message: 'Callback sent successfully'
  })
}));

// Mock status management utilities
jest.mock('../src/utils/statusManagement', () => ({
  validateStatusTransition: jest.fn().mockReturnValue(true),
  logStatusChange: jest.fn(),
  sendStatusNotification: jest.fn()
}));

describe('Drivers Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/driver/login', () => {
    it('should login driver successfully with valid credentials', async () => {
      const mockDriver = {
        id: 1,
        name: 'Test Driver',
        phone: '9876543210',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      Driver.findOne.mockResolvedValue(mockDriver);
      jwt.sign.mockReturnValue('fake-jwt-token');

      const response = await request(app)
        .post('/api/drivers/login')
        .send({
          phone: '9876543210',
          password: 'driver123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBe('fake-jwt-token');
      expect(Driver.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return 401 for invalid credentials', async () => {
      Driver.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/drivers/login')
        .send({
          phone: '9876543210',
          password: 'wrongpassword'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Driver not found');
    });

    it('should return 401 for invalid password', async () => {
      const mockDriver = {
        id: 1,
        name: 'Test Driver',
        phone: '9876543210',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      Driver.findOne.mockResolvedValue(mockDriver);

      const response = await request(app)
        .post('/api/drivers/login')
        .send({
          phone: '9876543210',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid password');
    });
  });

  describe('GET /api/drivers/:id/deliveries', () => {
    it('should return driver deliveries when authenticated', async () => {
      const mockDriver = {
        id: 1,
        name: 'Test Driver',
        phone: '9876543210'
      };

      const mockOrders = [
        {
          id: 1,
          order_id: 'TEST-001',
          customer_name: 'Customer 1',
          address: 'Address 1',
          pincode: '500001',
          status: 'Slot Selected'
        }
      ];

      // Mock JWT verification
      jwt.verify.mockImplementation(() => ({ id: 1 }));
      
      Driver.findByPk.mockResolvedValue(mockDriver);
      Order.findAll.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/drivers/1/deliveries')
        .set('Authorization', 'Bearer fake-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(Order.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/drivers/1/deliveries')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('PUT /api/drivers/:id/location', () => {
    it('should update driver location successfully', async () => {
      const mockDriver = {
        id: 1,
        name: 'Test Driver',
        phone: '9876543210',
        lat: 17.3850,
        lng: 78.4867,
        save: jest.fn().mockResolvedValue()
      };

      // Mock JWT verification
      jwt.verify.mockImplementation(() => ({ id: 1 }));
      
      Driver.findByPk.mockResolvedValue(mockDriver);

      const response = await request(app)
        .put('/api/drivers/1/update-location')
        .set('Authorization', 'Bearer fake-token')
        .send({
          lat: 17.3850,
          lng: 78.4867
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Driver location updated successfully');
    });
  });

  describe('PUT /api/drivers/:id/orders/:orderId/status', () => {
    it('should update order status successfully', async () => {
      const mockOrder = {
        id: 1,
        order_id: 'TEST-001',
        status: 'Slot Selected',
        save: jest.fn().mockResolvedValue()
      };

      // Mock JWT verification
      jwt.verify.mockImplementation(() => ({ id: 1 }));
      
      Order.findOne.mockResolvedValue(mockOrder);

      const response = await request(app)
        .put('/api/drivers/1/orders/1/status')
        .set('Authorization', 'Bearer fake-token')
        .send({
          status: 'Delivered'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Order status updated successfully');
      expect(mockOrder.save).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when order not found', async () => {
      // Mock JWT verification
      jwt.verify.mockImplementation(() => ({ id: 1 }));
      
      Order.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/drivers/1/orders/1/status')
        .set('Authorization', 'Bearer fake-token')
        .send({
          status: 'Out for Delivery'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found or not assigned to this driver');
    });
  });
});