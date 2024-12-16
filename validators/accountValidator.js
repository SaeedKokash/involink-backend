const Joi = require('joi');

exports.validateAccount = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    BICCode: Joi.string().required().pattern(new RegExp('^[A-Z]{4}[A-Z]{2}[0-9]{2}(?:[A-Z0-9]{3})?$')),
    bank_account_number: Joi.string().allow(null, '').pattern(new RegExp('^[0-9]{8,34}$')),
    IBAN: Joi.string().allow(null, '').pattern(new RegExp('^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$')),
    currency_code: Joi.string().required().valid('JOD', 'USD').default('JOD'),
    bank_name: Joi.string().allow(null, ''),
    bank_phone: Joi.string().allow(null, '').pattern(new RegExp('^[0-9]{10}$')),
    bank_street_address: Joi.string().allow(null, ''),
    bank_city: Joi.string().allow(null, ''),
    bank_zip_code: Joi.string().allow(null, ''),
    enabled: Joi.boolean().required(),
    alias_type: Joi.string().required().valid('alias', 'phone', 'email'),
    // alias value depends on alias_type
    // If alias_type is 'alias', then alias_value must be a valid string
    // If alias_type is 'phone', then alias_value must be a valid phone number string (e.g., 00962771234567 or 0791234567)
    // If alias_type is 'email', then alias_value must be a valid email string
    alias_value: Joi.string().required().when('alias_type', {
      is: 'alias',
      then: Joi.string().required(),
      otherwise: Joi.string().required().when('alias_type', {
        is: 'phone',
        then: Joi.string().required().pattern(new RegExp('^(00962|07)[0-9]{7,8}$')),
        otherwise: Joi.string().required().email(),
      }),
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
