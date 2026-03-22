const Joi = require("joi");

// Validate ObjectId (chuỗi 24 ký tự hex)
const objectId = Joi.string().length(24).hex();

// ======================
// ADD TO CART
// ======================
const addToCartSchema = Joi.object({
  body: Joi.object({
    idProductVariant: objectId.required().messages({
      "any.required": "idProductVariant là bắt buộc",
      "string.length": "idProductVariant không hợp lệ",
    }),
    quantity: Joi.number().integer().min(1).default(1).messages({
      "number.base": "quantity phải là số",
      "number.min": "quantity phải >= 1",
    }),
  }),
});

// ======================
// UPDATE CART ITEM
// ======================
const updateCartItemSchema = Joi.object({
  body: Joi.object({
    idItem: objectId.required().messages({
      "any.required": "idItem là bắt buộc",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      "any.required": "quantity là bắt buộc",
      "number.min": "quantity phải >= 1",
    }),
  }),
});

// ======================
// REMOVE ITEM
// ======================
const removeCartItemSchema = Joi.object({
  params: Joi.object({
    id: objectId.required().messages({
      "any.required": "id là bắt buộc",
    }),
  }),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
};