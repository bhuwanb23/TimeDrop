/**
 * validateProduct middleware
 */

const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).allow('', null),
  price: Joi.number().positive().precision(2).required(),
  stock_quantity: Joi.number().integer().min(0).default(0),
  category_id: Joi.number().integer().positive().required(),
  image_url: Joi.string().uri().allow('', null),
});

const validateProduct = (req, res, next) => {
  const { error, value } = productSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(d => d.message) });
  }
  req.validatedBody = value;
  next();
};

module.exports = { validateProduct, productSchema };