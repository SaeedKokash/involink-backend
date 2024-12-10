const Joi = require("joi");

exports.validateSignup = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")),
    password: Joi.string().min(6).required(),
    remember_token: Joi.string().allow(null, ""),
    last_logged_in_at: Joi.date().allow(null, ""),
    locale: Joi.string().allow(null, ""),
    landing_page: Joi.string().allow(null, ""),
    enabled: Joi.boolean().default(true),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: messages.join(", ") });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: messages.join(", ") });
  }
  next();
};
