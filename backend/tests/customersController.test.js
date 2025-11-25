const request = require('supertest');
const express = require('express');
const { Order } = require('../src/models');
const customersRoutes = require('../src/routes/customersRoutes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/customers', customersRoutes);

// Mock the database
jest.mock('../src/models', () => {
  const actualModels = jest.requireActual('../src/models');
  return {
    ...actualModels,
    Order: {
      findAll: jest.fn()
    }
  };
});

describe('Customers Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/customers/orders', () => {
    it('should return customer orders when phone number is provided', async () => {
      const mockOrders = [
        {
          id: 1,
          order_id: 'ORDER-001',
          customer_name: 'Test Customer',
          phone: '9876543210',
          address: 'Test Address',
          pincode: '500001',
          lat: 17.3850,
          lng: 78.4867,
          status: 'Slot Selected',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      Order.findAll.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/customers/orders?phone=9876543210')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(Order.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when phone number is not provided', async () => {
      const response = await request(app)
        .get('/api/customers/orders')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Phone number is required');
    });

    it('should return 400 when phone number format is invalid', async () => {
      const response = await request(app)
        .get('/api/customers/orders?phone=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid phone number format. Phone number must be 10 digits.');
    });
  });
});