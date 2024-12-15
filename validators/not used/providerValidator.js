const Joi = require('joi');

exports.validateProvider = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        api_key: Joi.string().allow(null, ''),
        enabled: Joi.boolean().default(false),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
