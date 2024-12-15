const Joi = require('joi');

exports.validateUserStoreAccess = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        store_id: Joi.number().required(),
        access_level: Joi.string().valid('read', 'write', 'admin').required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
