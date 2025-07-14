/**
 * sanitize middleware
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  var sanitized = {};
  for (var key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  next();
};

module.exports = { sanitizeInput, sanitizeString, sanitizeObject };