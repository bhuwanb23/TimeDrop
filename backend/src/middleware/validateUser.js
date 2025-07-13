/**
 * validateUser middleware
 */

const Joi = require('joi');

const registrationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('customer', 'driver').default('customer'),
});

const validateRegistration = (req, res, next) => {
  const { error, value } = registrationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(d => d.message) });
  }
  req.validatedBody = value;
  next();
};

module.exports = { validateRegistration };