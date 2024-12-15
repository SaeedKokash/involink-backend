const Joi = require('joi');

exports.validateUser = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().allow(null, ''),
        role: Joi.string().valid('admin', 'user', 'manager').required(),
        enabled: Joi.boolean().default(true),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
