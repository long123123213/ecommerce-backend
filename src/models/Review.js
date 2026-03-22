const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  idProductVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant"
  },
  idOrderItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderItem"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: String,
  status: {
    type: String,
    enum: ["VISIBLE", "HIDDEN"],
    default: "VISIBLE"
  }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
