const Joi = require('joi');

exports.validateTaggedEntity = (req, res, next) => {
    const schema = Joi.object({
        tag_id: Joi.number().required(),
        entity_id: Joi.number().required(),
        entity_type: Joi.string().required(), // Assuming this could be something like "Invoice", "Item", etc.
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
