const express = require("express");
const router = express.Router();

const addressController = require("../controllers/userAddress.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema
} = require("../validators/userAddress.validator");

router.get("/", authMiddleware, addressController.getUserAddresses);

router.post(
  "/",
  authMiddleware,
  validate(createAddressSchema),
  addressController.createAddress
);

router.put(
  "/:id",
  authMiddleware,
  validate(updateAddressSchema),
  addressController.updateAddress
);

router.delete(
  "/:id",
  authMiddleware,
  validate(deleteAddressSchema),
  addressController.deleteAddress
);

router.put(
  "/default/:id",
  authMiddleware,
  addressController.setDefaultAddress
);

module.exports = router;