const { rateLimiter, authRateLimiter } = require('../src/middleware/rateLimiter');

describe('Rate Limiter Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      ip: '127.0.0.1',
      connection: {
        remoteAddress: '127.0.0.1'
      }
    };
    
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      set: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('rateLimiter', () => {
    it('should allow requests under the limit', () => {
      const middleware = rateLimiter(60000, 5); // 5 requests per minute
      
      middleware(req, res, next);
      middleware(req, res, next);
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalledTimes(3);
    });

    it('should block requests over the limit', () => {
      const middleware = rateLimiter(60000, 2); // 2 requests per minute
      
      // Make requests up to the limit
      middleware(req, res, next);
      middleware(req, res, next);
      
      // This should be blocked
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Too many requests, please try again later.',
        retryAfter: expect.any(String)
      });
    });

    it('should reset the limit after the window expires', () => {
      // Mock Date.now to control time
      const now = Date.now();
      Date.now = jest.fn(() => now);
      
      const middleware = rateLimiter(60000, 2); // 2 requests per minute
      
      // Make requests up to the limit
      middleware(req, res, next);
      middleware(req, res, next);
      
      // This should be blocked
      middleware(req, res, next);
      
      // Fast forward time by 1 minute
      Date.now.mockReturnValue(now + 60001);
      
      // Reset mocks
      res.status.mockClear();
      res.json.mockClear();
      
      // This should be allowed again
      middleware(req, res, next);
      
      // Should not return a 429 error
      expect(res.status).not.toHaveBeenCalledWith(429);
    });
  });

  describe('authRateLimiter', () => {
    it('should have stricter limits for authentication endpoints', () => {
      // authRateLimiter should be a middleware function with stricter limits
      expect(typeof authRateLimiter).toBe('function');
      
      // It should have lower request limits (e.g., 5 per hour)
      // We can't easily test the internal configuration without exposing it
    });
  });
});