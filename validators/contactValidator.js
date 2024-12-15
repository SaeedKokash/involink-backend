const Joi = require('joi');

exports.validateContact = (req, res, next) => {
  const schema = Joi.object({
    store_id: Joi.number().required(),
    user_id: Joi.number().allow(null),
    type: Joi.string().valid('customer', 'supplier', 'other').default('other'),
    name: Joi.string().required(),
    email: Joi.string().email(),
    tax_number: Joi.string().allow(null, ''),
    phone: Joi.string().allow(null, ''),
    street_address: Joi.string().allow(null, ''),
    city: Joi.string().allow(null, ''),
    zip_code: Joi.string().allow(null, ''),
    website: Joi.string().uri().allow(null, ''),
    enabled: Joi.boolean(),
    reference: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
    alias_type: Joi.string().valid('alias', 'iban', 'mobile').allow(null),
    alias_value: Joi.string().allow(null, ''),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
