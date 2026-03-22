const Joi = require("joi");

// ObjectId chuẩn Mongo
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

// CREATE
const createProductSchema = Joi.object({
  body: Joi.object({
    nameProduct: Joi.string().min(3).max(200).trim().required(),

    description: Joi.string().allow("").max(2000),

    idCategory: objectId.required(),

    selectedTags: Joi.string().optional(),
    customTags: Joi.string().optional()
  }).unknown(true),

  query: Joi.object({}).unknown(true),
  params: Joi.object({})
});

// UPDATE
const updateProductSchema = Joi.object({
  body: Joi.object({
    nameProduct: Joi.string().min(3).max(200),

    description: Joi.string().allow("").max(2000),

    idCategory: objectId,

    oldImages: Joi.string().optional(),

    selectedTags: Joi.string().optional(),
    customTags: Joi.string().optional()
  }).unknown(true),

  params: Joi.object({
    id: objectId.required()
  }),

  query: Joi.object({}).unknown(true)
});

// FILTER
const filterSchema = Joi.object({
  query: Joi.object({
    size: Joi.string(),
    color: Joi.string(),
    category: Joi.string(),
    price: Joi.string().valid("0-200", "200-400", "400-600", "600+"),
    sort: Joi.string().valid("price_asc", "price_desc"),
    search: Joi.string().allow("")
  }).unknown(true),

  body: Joi.object({}),
  params: Joi.object({})
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  filterSchema
};