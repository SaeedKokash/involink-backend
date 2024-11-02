const Joi = require('joi');

exports.validateItem = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    sku: Joi.string().min(2).required(),
    description: Joi.string().allow(''),
    sale_price: Joi.number().min(0).required(),
    purchase_price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(0).required(),
    tax_id: Joi.number().integer().allow(null),
    enabled: Joi.boolean(),
    // store_id: Joi.number().integer().required(),
    // category_id: Joi.number().integer().allow(null), // Future use
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return next({ statusCode: 400, messages });
  }
  next();
}