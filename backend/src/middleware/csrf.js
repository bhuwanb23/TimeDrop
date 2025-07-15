/**
 * csrf middleware
 */

const crypto = require('crypto');
const csrfTokens = new Map();

const generateCsrfToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = req.session ? req.session.id : req.ip;
  csrfTokens.set(sessionId, { token: token, expiresAt: Date.now() + 3600000 });
  res.cookie('XSRF-TOKEN', token, { httpOnly: true, sameSite: 'strict' });
  req.csrfToken = token;
  next();
};

const validateCsrfToken = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].indexOf(req.method) !== -1) return next();
  var token = req.headers['x-csrf-token'] || (req.body && req.body._csrf);
  var sessionId = req.session ? req.session.id : req.ip;
  var stored = csrfTokens.get(sessionId);
  if (!token || !stored || token !== stored.token || Date.now() > stored.expiresAt) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  csrfTokens.delete(sessionId);
  next();
};

module.exports = { generateCsrfToken, validateCsrfToken };