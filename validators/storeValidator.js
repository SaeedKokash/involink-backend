const Joi = require("joi");

exports.validateCreateStore = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    enabled: Joi.boolean().required(),
    street_address: Joi.string().allow(null),
    city: Joi.string().allow(null),
    zip_code: Joi.string().allow(null),
    phone_number: Joi.string().allow(null),
    email: Joi.string().email().allow(null),
    logo: Joi.string().allow(null),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.validateUpdateStore = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().allow(null),
    enabled: Joi.boolean().allow(null),
    street_address: Joi.string().allow(null),
    city: Joi.string().allow(null),
    zip_code: Joi.string().allow(null),
    phone_number: Joi.string().allow(null).pattern(new RegExp('^[0-9]{10}$')),
    email: Joi.string().email().allow(null),
    logo: Joi.string().allow(null),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}
