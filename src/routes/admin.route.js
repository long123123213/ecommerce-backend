const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware=require("../middlewares/admin.middleware");
router.get("/dashboard", authMiddleware,adminMiddleware,adminController.getDashboard);
router.get("/revenue-by-date", authMiddleware,adminMiddleware,adminController.getRevenueByDate);
router.get("/top-products",authMiddleware,adminMiddleware, adminController.getTopProducts);
router.get("/top-users", authMiddleware,adminMiddleware,adminController.getTopUsers);

module.exports = router;