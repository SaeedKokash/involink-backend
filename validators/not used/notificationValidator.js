const Joi = require('joi');

exports.validateNotification = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        type: Joi.string().required(),
        message: Joi.string().required(),
        read: Joi.boolean().default(false),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
