const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
     lastMessage: {
    type: String
  },

  lastMessageAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
