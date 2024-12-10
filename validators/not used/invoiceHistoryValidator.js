const Joi = require('joi');

exports.validateInvoiceHistory = (req, res, next) => {
    const schema = Joi.object({
        invoice_id: Joi.number().required(),
        status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').required(),
        updated_at: Joi.date().required(),
        notes: Joi.string().allow(null, ''),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
