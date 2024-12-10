const Joi = require('joi');

exports.validateRolePermission = (req, res, next) => {
    const schema = Joi.object({
        role_id: Joi.number().required(),
        permission_id: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
