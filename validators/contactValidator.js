const Joi = require('joi');

exports.validateContact = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    type: Joi.string().valid('customer', 'supplier').required(),
    tax_number: Joi.string().allow(''),
    address: Joi.string().allow(''),
    website: Joi.string().allow(''), //.uri(),
    currency_code: Joi.string().allow(''),
    enabled: Joi.boolean(),
    reference: Joi.string().allow(''),
    // store_id: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  next();
};
