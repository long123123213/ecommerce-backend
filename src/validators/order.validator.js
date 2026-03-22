const Joi = require("joi");

// 🧾 Tạo đơn hàng
const createOrderSchema = Joi.object({
  body: Joi.object({
    receiverName: Joi.string().min(2).max(100).required(),

    phone: Joi.string()
      .pattern(/^[0-9]{9,11}$/)
      .required()
      .messages({
        "string.pattern.base": "Số điện thoại không hợp lệ",
      }),

    addressLine: Joi.string().min(5).required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),

    shippingMethod: Joi.string()
      .valid("COD", "VNPAY", "MOMO")
      .required(),

    shippingFee: Joi.number().min(0).default(0),
  }),
});

// 🔄 Update status (admin)
const updateStatusSchema = Joi.object({
  body: Joi.object({
    status: Joi.string()
      .valid("PENDING", "CONFIRMED", "SHIPPING", "DONE", "CANCEL")
      .required(),
  }),

  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
});

// ❌ Cancel order
const cancelOrderSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  createOrderSchema,
  updateStatusSchema,
  cancelOrderSchema,
};