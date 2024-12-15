const Joi = require('joi');

exports.validateTransaction = (req, res, next) => {
    const schema = Joi.object({
        account_id: Joi.number().required(),
        amount: Joi.number().required(),
        transaction_date: Joi.date().required(),
        description: Joi.string().allow(null, ''),
        type: Joi.string().valid('credit', 'debit').required(),
        reference: Joi.string().allow(null, ''),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
