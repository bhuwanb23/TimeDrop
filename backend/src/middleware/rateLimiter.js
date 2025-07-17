/**
 * rateLimiter middleware
 */

const rateLimit = new Map();

const createRateLimiter = (windowMs, maxRequests) => {
  windowMs = windowMs || 900000;
  maxRequests = maxRequests || 100;
  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    if (!rateLimit.has(key)) {
      rateLimit.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    const record = rateLimit.get(key);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    record.count++;
    if (record.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };
};

const authLimiter = createRateLimiter(900000, 20);
const apiLimiter = createRateLimiter(900000, 100);

module.exports = { createRateLimiter, authLimiter, apiLimiter };