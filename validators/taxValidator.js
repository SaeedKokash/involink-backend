const Joi = require('joi');

exports.validateTax = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        rate: Joi.number().min(0).max(100).required(),
        type: Joi.string().valid('sales', 'purchase').required(),
        enabled: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
