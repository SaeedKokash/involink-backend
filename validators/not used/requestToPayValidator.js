const Joi = require('joi');

exports.validateRequestToPay = (req, res, next) => {
    const schema = Joi.object({
        invoice_id: Joi.number().required(),
        amount: Joi.number().min(0).required(),
        currency_code: Joi.string().required(),
        status: Joi.string().valid('pending', 'completed', 'failed').default('pending'),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
