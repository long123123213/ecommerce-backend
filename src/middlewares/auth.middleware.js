const jwt=require("jsonwebtoken");
const User=require("../models/User");

module.exports= async(req,res,next)=>{
try{
const authHeader=req.headers.authorization;
if(!authHeader){
    return res.status(400).json({message:"Chưa đăng nhập"});
}
const token=authHeader.split(" ")[1];
const decoded=jwt.verify(token,process.env.JWT_SECRET);
const user= await User.findById(decoded.userId).select("-password");
if(!user){
    return res.status(401).json({message:"User không tồn tại!"});
}
req.user=user;
next();
}
catch(error){
res.status(401).json({message:"Token không hợp lệ"});
}
};