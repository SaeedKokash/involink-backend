const Joi = require('joi');

exports.validateInvoice = (req, res, next) => {
  const schema = Joi.object({
    store_id: Joi.number().required(),
    contact_id: Joi.number().allow(null),
    invoice_number: Joi.string().required(),
    order_number: Joi.string().allow(null, ''),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').default('draft'),
    invoiced_at: Joi.date().allow(null),
    due_at: Joi.date().allow(null),
    paid_at: Joi.date().allow(null),
    amount: Joi.number().min(0).required(),
    currency_code: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
    footer: Joi.string().allow(null, ''),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
