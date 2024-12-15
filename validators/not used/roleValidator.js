const Joi = require('joi');

exports.validateRole = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        permissions: Joi.array().items(Joi.number()).optional(), // Assuming permissions are an array of IDs
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
