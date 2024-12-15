const Joi = require('joi');

exports.validateItem = (req, res, next) => {
    const schema = Joi.object({
        store_id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        sku: Joi.string().allow(null, ''),
        purchase_price: Joi.number().min(0).allow(null),
        sale_price: Joi.number().min(0).required(),
        stock_quantity: Joi.number().min(0).allow(null),
        enabled: Joi.boolean(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
