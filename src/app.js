const express=require("express");
const cors=require("cors");

const autoCancelPendingOrders = require("./utils/autoCancelOrders");
const authRoutes=require("./routes/auth.route");
const categoryRoutes=require("./routes/category.route");
const productRoutes=require("./routes/product.route");
const productVariantRoutes=require("./routes/productVariant.route");
const cartRoutes=require("./routes/cart.route");
const orderRoutes=require("./routes/order.route");
const reviewRoutes=require("./routes/review.route");
const userAddressRoutes = require("./routes/userAddress.route");
const userRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.routes");
const bannerRoutes=require("./routes/banner.route");
const vnpayRoutes=require("./routes/vnpay.route");
const adminRoutes = require("./routes/admin.route");
const path = require("path");
const app=express();

app.use(cors({
  origin: "https://ecommerce-frontend-ckjq.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // thêm PATCH
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads", express.static(path.join(__dirname,"uploads")));


app.use("/api/auth",authRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/variants",productVariantRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/products",productRoutes);
app.use("/api/addresses", userAddressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/banners",bannerRoutes);
app.use("/api/vnpay", vnpayRoutes);
app.use("/api/admin", adminRoutes);
app.get("/",(req,res)=>{
    res.send("API is running...");
});
setInterval(() => autoCancelPendingOrders(1), 60 * 1000);
module.exports=app;