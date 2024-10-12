const Joi = require('joi');

exports.validateInvoice = (req, res, next) => {
  const schema = Joi.object({
    invoice_number: Joi.string().required(),
    order_number: Joi.string().allow(''),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue').required(),
    invoiced_at: Joi.date().required(),
    due_at: Joi.date().required(),
    amount: Joi.number().min(0).required(),
    currency_code: Joi.string().required(),
    currency_rate: Joi.number().min(0).required(),
    contact_id: Joi.number().integer().required(),
    contact_name: Joi.string().required(),
    contact_email: Joi.string().email().required(),
    contact_tax_number: Joi.string().allow(''),
    contact_phone: Joi.string().required(),
    contact_address: Joi.string().required(),
    notes: Joi.string().allow(''),
    footer: Joi.string().allow(''),
    store_id: Joi.number().integer().required(),
    invoice_items: Joi.array().items(
      Joi.object({
        name: Joi.string().allow(''),
        sku: Joi.string().allow(''),
        item_id: Joi.number().integer().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        discount_rate: Joi.number().min(0).allow(0),
        discount_type: Joi.string().valid('fixed', 'percentage').required(),
        taxes: Joi.array().items(Joi.number().integer()).allow(null),
      })
    ).min(1).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  next();
};

// "amount" is required, 
// "invoice_items[0].name" is not allowed, 
// "invoice_items[0].sku" is not allowed, 
// "invoice_items[1].name" is not allowed, 
// "invoice_items[1].sku" is not allowed