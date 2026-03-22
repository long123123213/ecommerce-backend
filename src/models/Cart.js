const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    idUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
    }
},{timestamps:true});

module.exports=mongoose.model("Cart",cartSchema);