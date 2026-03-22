const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller");
const upload = require("../middlewares/upload");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware=require("../middlewares/admin.middleware");
const {
  createProductSchema,
  updateProductSchema,
  filterSchema
} = require("../validators/product.validate");
//Route public
router.get("/",validate(filterSchema),productController.getProducts);
router.get("/category/:categoryId",productController.getProductsByCategory);
router.get("/filters", productController.getFilters);
router.get("/:param", productController.getProductByParam);
//Route admin
router.post("/", authMiddleware,adminMiddleware,upload.array("images", 5),  validate(createProductSchema),productController.createProduct);
router.patch("/:id",authMiddleware,adminMiddleware, upload.array("images", 5), validate(updateProductSchema),productController.updateProduct); 
router.delete("/:id",authMiddleware,adminMiddleware, productController.deleteProduct);

module.exports=router;