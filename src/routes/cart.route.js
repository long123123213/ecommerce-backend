const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const authMiddleWare = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} = require("../validators/cart.validator");

// =====================
// ROUTES
// =====================

router.get("/", authMiddleWare, cartController.getCart);

router.post(
  "/add",
  authMiddleWare,
  validate(addToCartSchema),
  cartController.addToCart
);

router.put(
  "/update",
  authMiddleWare,
  validate(updateCartItemSchema),
  cartController.updateCartItem
);

router.delete(
  "/remove/:id",
  authMiddleWare,
  validate(removeCartItemSchema),
  cartController.removeCartItem
);

module.exports = router;