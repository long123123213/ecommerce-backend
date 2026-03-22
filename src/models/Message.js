const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  idConversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: String,
  type: {
    type: String,
    enum: ["TEXT", "IMAGE"],
    default: "TEXT"
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
