const mongoose=require('mongoose');

const cartItemSchema=new mongoose.Schema({
    quantity:{type:Number, default:1,},
    idCart:{type:mongoose.Schema.Types.ObjectId,
    ref:"Cart",
},
    idProductVariant:{type:mongoose.Schema.Types.ObjectId,
        ref:"ProductVariant",
    }
}, { timestamps: true });

module.exports=mongoose.model('CartItem',cartItemSchema);