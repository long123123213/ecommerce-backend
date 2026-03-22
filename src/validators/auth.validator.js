const Joi = require("joi");

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(50).required(),

    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),

    phone: Joi.string()
      .pattern(/^[0-9]{9,11}$/)
      .optional()
  }).required()
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }).required()
});

module.exports = {
  registerSchema,
  loginSchema
};