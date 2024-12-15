const Joi = require('joi');

exports.validateTaxRates = (req, res, next) => {
    const schema = Joi.object({
        tax_id: Joi.number().required(),
        rate: Joi.number().min(0).max(100).required(),
        effective_date: Joi.date().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
