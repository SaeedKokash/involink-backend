const Joi = require('joi');

exports.validateStore = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        address: Joi.string().allow(null, ''),
        phone: Joi.string().allow(null, ''),
        email: Joi.string().email().allow(null, ''),
        enabled: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};