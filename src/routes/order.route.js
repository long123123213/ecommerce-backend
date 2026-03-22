const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const validate = require("../middlewares/validate.middleware");

// ✅ IMPORT VALIDATOR
const {
  createOrderSchema,
  updateStatusSchema,
  cancelOrderSchema,
} = require("../validators/order.validator");

// 🧾 Tạo đơn
router.post(
  "/",
  authMiddleware,
  validate(createOrderSchema),
  orderController.createOrder
);

// 📦 Đơn của tôi
router.get("/my", authMiddleware, orderController.getMyOrders);

// 🔄 Admin cập nhật trạng thái
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  validate(updateStatusSchema),
  orderController.updateOrderStatus
);

// ❌ Hủy đơn
router.put(
  "/:id/cancel",
  authMiddleware,
  validate(cancelOrderSchema),
  orderController.cancelOrder
);

// 📋 Admin lấy tất cả đơn
router.get("/", authMiddleware, adminMiddleware, orderController.getAllOrders);

module.exports = router;