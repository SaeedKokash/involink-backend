const Joi = require('joi');

exports.validateAccount = (req, res, next) => {
  const schema = Joi.object({
    store_id: Joi.number().required(),
    name: Joi.string().required(),
    BICCode: Joi.string().allow(null, ''),
    bank_account_number: Joi.string().allow(null, ''),
    IBAN: Joi.string().allow(null, ''),
    alias_type: Joi.string().valid('alias', 'iban', 'mobile').required(),
    alias_value: Joi.string().required(),
    currency_code: Joi.string().valid('JOD', 'USD').default('JOD'),
    bank_name: Joi.string().allow(null, ''),
    bank_phone: Joi.string().allow(null, ''),
    bank_street_address: Joi.string().allow(null, ''),
    bank_city: Joi.string().allow(null, ''),
    bank_zip_code: Joi.string().allow(null, ''),
    enabled: Joi.boolean()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
