const mongoose = require("mongoose");

const conversationUserSchema = new mongoose.Schema({
  idConversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  roleInConversation: {
    type: String,
    enum: ["ADMIN", "USER"]
  }
});

module.exports = mongoose.model("ConversationUser", conversationUserSchema);
