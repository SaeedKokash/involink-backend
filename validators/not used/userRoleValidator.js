const Joi = require('joi');

exports.validateUserRole = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        role_id: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
