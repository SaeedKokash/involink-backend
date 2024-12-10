const Joi = require('joi');

exports.validateMedia = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid('image', 'video', 'document').required(),
        url: Joi.string().uri().required(),
        description: Joi.string().allow(null, ''),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
