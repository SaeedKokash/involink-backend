// validators/taxValidator.js
const Joi = require('joi');

exports.validateTax = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    rate: Joi.number().min(0).max(100).required(),
    type: Joi.string().valid('sales', 'purchase').required(),
    enabled: Joi.boolean(),
    store_id: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  next();
};
