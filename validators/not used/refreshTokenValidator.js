const Joi = require('joi');

exports.validateRefreshToken = (req, res, next) => {
    const schema = Joi.object({
        token: Joi.string().required(),
        user_id: Joi.number().required(),
        expires_at: Joi.date().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
