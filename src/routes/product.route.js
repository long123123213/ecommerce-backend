const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller");
const upload = require("../middlewares/upload");
const validate = require("../middlewares/validate.middleware");

const {
  createProductSchema,
  updateProductSchema,
  filterSchema
} = require("../validators/product.validate");
router.post("/", upload.array("images", 5),  validate(createProductSchema),productController.createProduct);
router.get("/",validate(filterSchema),productController.getProducts);
router.get("/category/:categoryId",productController.getProductsByCategory);
// chỉ 1 route duy nhất

router.patch("/:id", upload.array("images", 5), validate(updateProductSchema),productController.updateProduct); 
router.delete("/:id", productController.deleteProduct);
router.get("/filters", productController.getFilters);
router.get("/:param", productController.getProductByParam);
module.exports=router;