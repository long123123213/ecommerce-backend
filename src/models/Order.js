const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    receiverName:String,
    phone:String,
    addressLine:String,
    ward:String,
    district:String,
    city:String,
    shippingMethod:String,
    shippingFee:Number,
    total:Number,
    status:{
    type: String,
    enum: ["PENDING", "CONFIRMED", "SHIPPING", "DONE", "CANCEL"],
    default: "PENDING"
  },
paymentStatus: {
  type: String,
  enum: ["UNPAID", "PAID"],
  default: "UNPAID"
}

},{timestamps:true});

module.exports=mongoose.model("Order",orderSchema);