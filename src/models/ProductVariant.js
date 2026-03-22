const mongoose=require("mongoose");

const productVariantSchema=new mongoose.Schema({
    idProduct:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Product",
         required:true,
    },
    size:String,
    color:String,
    price:Number,
    stock:Number,
},{timestamps:true});

module.exports=mongoose.model("ProductVariant",productVariantSchema);