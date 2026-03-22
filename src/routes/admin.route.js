const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminController.getDashboard);
router.get("/revenue-by-date", adminController.getRevenueByDate);
router.get("/top-products", adminController.getTopProducts);
router.get("/top-users", adminController.getTopUsers);

module.exports = router;