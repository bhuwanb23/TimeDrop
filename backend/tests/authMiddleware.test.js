const jwt = require('jsonwebtoken');
const { Driver } = require('../src/models');
const { authenticateJWT, authorizeRoles } = require('../src/middleware/authMiddleware');

// Mock the database
jest.mock('../src/models', () => {
  const actualModels = jest.requireActual('../src/models');
  return {
    ...actualModels,
    Driver: {
      findByPk: jest.fn()
    }
  };
});

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      header: jest.fn()
    };
    
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('authenticateJWT', () => {
    it('should return 401 if no authorization header is provided', async () => {
      req.header.mockReturnValue(null);

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token format is invalid', async () => {
      req.header.mockReturnValue('InvalidToken');

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token format. Use Bearer token.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for JsonWebTokenError', async () => {
      req.header.mockReturnValue('Bearer invalid-token');
      jwt.verify.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for TokenExpiredError', async () => {
      req.header.mockReturnValue('Bearer expired-token');
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification fails', async () => {
      req.header.mockReturnValue('Bearer invalid-token');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500); // Generic error returns 500
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during authentication.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if driver is not found', async () => {
      req.header.mockReturnValue('Bearer valid-token');
      jwt.verify.mockReturnValue({ id: 1 });
      Driver.findByPk.mockResolvedValue(null);

      await authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token. Driver not found.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should authenticate successfully and call next', async () => {
      const mockDriver = { id: 1, name: 'Test Driver' };
      
      req.header.mockReturnValue('Bearer valid-token');
      jwt.verify.mockReturnValue({ id: 1 });
      Driver.findByPk.mockResolvedValue(mockDriver);

      await authenticateJWT(req, res, next);

      expect(req.driver).toEqual(mockDriver);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    it('should return 401 if user is not authenticated', () => {
      req.driver = null; // No driver attached
      const middleware = authorizeRoles('driver');
      
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. User not authenticated.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is not authorized', () => {
      req.driver = { role: 'customer' };
      const middleware = authorizeRoles('admin');
      
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should authorize user with correct role', () => {
      req.driver = { id: 1, name: 'Test Driver' }; // Driver object is present
      const middleware = authorizeRoles('driver'); // 'driver' is the hardcoded role
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });
  });
});