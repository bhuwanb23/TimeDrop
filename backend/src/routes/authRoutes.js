const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { validateAuthLogin } = require('../middleware/validationMiddleware');

router.post('/login', authRateLimiter, validateAuthLogin, login);

module.exports = router;

