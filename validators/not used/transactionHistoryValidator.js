const Joi = require('joi');

exports.validateTransactionHistory = (req, res, next) => {
    const schema = Joi.object({
        transaction_id: Joi.number().required(),
        status: Joi.string().valid('pending', 'completed', 'failed').required(),
        updated_at: Joi.date().required(),
        notes: Joi.string().allow(null, ''),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
