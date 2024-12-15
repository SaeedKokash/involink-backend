const Joi = require('joi');

exports.validateStoreMedia = (req, res, next) => {
    const schema = Joi.object({
        store_id: Joi.number().required(),
        media_id: Joi.number().required(),
        type: Joi.string().valid('image', 'video', 'document').required(),
        description: Joi.string().allow(null, ''),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
