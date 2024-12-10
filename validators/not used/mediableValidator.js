const Joi = require('joi');

exports.validateMediable = (req, res, next) => {
    const schema = Joi.object({
        mediable_id: Joi.number().required(),
        media_id: Joi.number().required(),
        mediable_type: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
