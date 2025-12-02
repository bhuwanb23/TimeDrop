/**
 * Simple in-memory rate limiter middleware
 * In a production environment, you would use Redis or another distributed store
 */

// In-memory store for rate limiting
const rateLimitStore = new Map();

/**
 * Rate limiting middleware
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum number of requests allowed in the window
 */
const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    try {
      // Get the client's IP address
      const clientId = req.ip || req.connection.remoteAddress;
      
      // Get the current time
      const now = Date.now();
      
      // Get the client's request data from the store
      const clientData = rateLimitStore.get(clientId) || {
        requests: [],
        resetTime: now + windowMs
      };
      
      // Filter out requests that are outside the current window
      const validRequests = clientData.requests.filter(timestamp => 
        timestamp > now - windowMs
      );
      
      // Check if the reset time has passed
      if (now > clientData.resetTime) {
        // Reset the window
        validRequests.length = 0;
        clientData.resetTime = now + windowMs;
      }
      
      // Check if the client has exceeded the rate limit
      if (validRequests.length >= maxRequests) {
        // Calculate how long until the rate limit resets
        const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
        
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
          retryAfter: `${retryAfter} seconds`
        });
      }
      
      // Add the current request to the client's request history
      validRequests.push(now);
      clientData.requests = validRequests;
      
      // Update the store
      rateLimitStore.set(clientId, clientData);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': maxRequests - validRequests.length,
        'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
      });
      
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // If there's an error with rate limiting, allow the request to proceed
      next();
    }
  };
};

/**
 * Specific rate limiter for authentication endpoints
 * More restrictive to prevent brute force attacks
 * Increased limits for development/testing
 */
const authRateLimiter = rateLimiter(15 * 60 * 1000, 20); // 20 requests per 15 minutes (more reasonable for testing)

// Function to reset rate limit store (useful for testing)
const resetRateLimitStore = () => {
  rateLimitStore.clear();
};

module.exports = {
  rateLimiter,
  authRateLimiter,
  resetRateLimitStore
};