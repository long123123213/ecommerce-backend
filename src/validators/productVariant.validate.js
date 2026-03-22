const Joi = require("joi");

// ObjectId regex
const objectId = /^[0-9a-fA-F]{24}$/;

const createVariantSchema = Joi.object({
  body: Joi.object({
    idProduct: Joi.string().pattern(objectId).required(),

    size: Joi.string().max(10).allow("", null),

    color: Joi.string().max(20).allow("", null),

    price: Joi.number().min(0).required(),

    stock: Joi.number().min(0).required(),
  }).unknown(true),

  params: Joi.object().unknown(true),

  query: Joi.object().unknown(true),
});

const updateVariantSchema = Joi.object({
  body: Joi.object({
    size: Joi.string().max(10),

    color: Joi.string().max(20),

    price: Joi.number().min(0),

    stock: Joi.number().min(0),
  }).unknown(true),

  params: Joi.object({
    id: Joi.string().pattern(objectId).required(),
  }),

  query: Joi.object().unknown(true),
});

module.exports = {
  createVariantSchema,
  updateVariantSchema,
};