const Joi = require('joi');

exports.validateInvoiceItem = (req, res, next) => {
    const schema = Joi.object({
        invoice_id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        quantity: Joi.number().min(1).required(),
        unit_price: Joi.number().min(0).required(),
        discount: Joi.number().min(0).max(100).allow(null, 0),
        total: Joi.number().min(0).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
