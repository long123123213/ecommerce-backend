const express = require("express");
const router = express.Router();

const controller = require("../controllers/productVariant.controller");
const validate = require("../middlewares/validate.middleware");

const {
  createVariantSchema,
  updateVariantSchema,
} = require("../validators/productVariant.validate");

// CREATE
router.post("/", validate(createVariantSchema), controller.createVariant);

// UPDATE
router.patch("/:id", validate(updateVariantSchema), controller.updateVariant);

// DELETE (có thể thêm validate nếu muốn)
router.delete("/:id", controller.deleteVariant);

module.exports = router;