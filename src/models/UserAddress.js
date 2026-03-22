const mongoose=require("mongoose");
const { schema } = require("./User");

const userAddressSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });


module.exports=mongoose.model("UserAddress",userAddressSchema);