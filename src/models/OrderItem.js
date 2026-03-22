const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  idOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  idProductVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant"
  },
  quantity: Number,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model("OrderItem", orderItemSchema);
