const Joi = require('joi');

exports.validateAccount = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    type: Joi.string().valid('asset', 'liability', 'equity', 'revenue', 'expense').required(),
    number: Joi.string().allow(''),
    currency_code: Joi.string().allow(''),
    opening_balance: Joi.number().min(0).required(),
    bank_name: Joi.string().allow(''),
    bank_phone: Joi.string().allow(''),
    bank_address: Joi.string().allow(''),
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