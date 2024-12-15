const Joi = require('joi');

exports.validateApiPaymentIntegration = (req, res, next) => {
    const schema = Joi.object({
        provider_id: Joi.number().integer().required(),
        status: Joi.string().valid('inactive', 'active').default('inactive'),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
