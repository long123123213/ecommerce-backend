const Review=require("../models/Review");
const Order=require("../models/Order");
const OrderItem=require("../models/OrderItem");

//Create Review 
async function createReview(req,res){
    try{
        const {idOrderItem,rating,comment}=req.body;

        //Check orderitem
        const orderItem=await OrderItem.findById(idOrderItem);
        if(!orderItem){
            res.status(404).json({ message: "Order item không tồn tại" });
        }

        // Check order done
        const order=await Order.findById(orderItem.idOrder);
        if(!order||order.status!=="DONE"){
            res.status(400).json({message: "Đơn hàng chưa hoàn tất" });
        }

        //Check role user
        if(order.idUser.toString()!==req.user._id.toString()){
            return res.status(403).json({ message: "Không có quyền đánh giá" });
        }
        // Check nếu user đã review orderItem này
const existingReview = await Review.findOne({ idOrderItem });
if (existingReview) {
  return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
}
        //Create review
        const review=await Review.create({
            idUser:req.user._id,
            idProductVariant:orderItem.idProductVariant,
            idOrderItem,
            rating,
            comment
        });
        res.status(201).json(review);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

//Get reviews by product variant
async function getReviewsByVariant(req,res){
    const reviews=await Review.find({
        idProductVariant:req.params.idVariant,
        status:"VISIBLE"
    }).populate("idUser","name");
      res.json(reviews);
};
//Update review user
async function updateReview(req,res){
try{
const review=await Review.findById(req.params.id);
if (!review) return res.status(404).json({ message: "Review không tồn tại" });
 // Chỉ user tạo review mới được sửa
    if (review.idUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền sửa review" });
    }
//Cap nhat
const {rating , comment}=req.body;
review.rating=rating??review.rating;
review.comment=comment ??review.comment;
await review.save();
res.json(review);
}

catch(error){
    res.status(500).json({ message: error.message });
}
};

async function updateReviewStatus(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review không tồn tại" });

    // Chỉ admin mới được chỉnh status
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Không có quyền" });
    }

    review.status = req.body.status; // VISIBLE / HIDDEN
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports={createReview,getReviewsByVariant,updateReview,updateReviewStatus};  