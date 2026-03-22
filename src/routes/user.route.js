const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware=require("../middlewares/admin.middleware");
// admin only
router.get("/", authMiddleware,adminMiddleware, userController.getUsers);
router.get("/:id", authMiddleware,adminMiddleware, userController.getUserById);
router.put("/:id", authMiddleware,adminMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware,adminMiddleware, userController.deleteUser);

module.exports = router;