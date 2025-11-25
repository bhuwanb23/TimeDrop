const { validateOrderCreation, validateSlotSelection } = require('../src/middleware/validationMiddleware');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('validateOrderCreation', () => {
    it('should return 400 if required fields are missing', () => {
      req.body = {
        order_id: 'TEST-001',
        customer_name: 'Test Customer'
        // Missing other required fields
      };

      validateOrderCreation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.arrayContaining([
          'Phone number is required',
          'Address is required',
          'Pincode is required',
          'Latitude is required',
          'Longitude is required'
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if phone number is invalid', () => {
      req.body = {
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: 'invalid-phone',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867
      };

      validateOrderCreation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.arrayContaining([
          'Invalid phone number format'
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if pincode is invalid', () => {
      req.body = {
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: 'invalid-pincode',
        lat: 17.3850,
        lng: 78.4867
      };

      validateOrderCreation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.arrayContaining([
          'Invalid pincode format (must be 6 digits)'
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should validate order creation successfully', () => {
      req.body = {
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: '9876543210',
        address: 'Test Address',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867
      };

      validateOrderCreation(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateSlotSelection', () => {
    it('should return 400 if slot date or time is missing', () => {
      req.body = {
        slot_date: '2025-02-15'
        // Missing slot_time
      };

      validateSlotSelection(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: expect.arrayContaining([
          'Slot time is required'
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should validate slot selection successfully', () => {
      req.body = {
        slot_date: '2025-02-15',
        slot_time: '10AM - 12PM'
      };

      validateSlotSelection(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});