module.exports=(req,res,next)=>{
if(req.user.role !== "ADMIN"){
    return res.status(403).json({message:"Không có quyền truy cập"});
}
next();
};