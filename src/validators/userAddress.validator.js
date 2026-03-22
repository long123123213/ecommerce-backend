const Joi = require("joi");

// CREATE ADDRESS
const createAddressSchema = Joi.object({
  body: Joi.object({
    receiverName: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^[0-9]{9,11}$/).required(),
    addressLine: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    isDefault: Joi.boolean().optional()
  }).required()
});

// UPDATE ADDRESS
const updateAddressSchema = Joi.object({
  body: Joi.object({
    receiverName: Joi.string().min(2).optional(),
    phone: Joi.string().pattern(/^[0-9]{9,11}$/).optional(),
    addressLine: Joi.string().optional(),
    ward: Joi.string().optional(),
    district: Joi.string().optional(),
    city: Joi.string().optional(),
    isDefault: Joi.boolean().optional()
  }).required(),
  params: Joi.object({
    id: Joi.string().required()
  }).required()
});

// DELETE ADDRESS
const deleteAddressSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required()
});

module.exports = {
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema
};