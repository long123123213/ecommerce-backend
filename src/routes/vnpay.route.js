const express = require("express");
const router = express.Router();
const vnpayController = require("../controllers/vnpay.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.post("/create",authMiddleware, vnpayController.createPayment);
router.get("/return", vnpayController.vnpayReturn);
router.post("/recreate", authMiddleware, vnpayController.recreatePayment); // 🔹 thêm route mới
module.exports = router;