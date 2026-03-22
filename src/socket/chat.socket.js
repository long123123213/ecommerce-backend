const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // join room conversation
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation ${conversationId}`);
    });

    // gửi tin nhắn
    socket.on("sendMessage", async (data) => {

      try {

        const { conversationId, userId, content, type } = data;

        if (!conversationId || !userId || !content) {
          return;
        }

        // lưu message
        let message = await Message.create({
          idConversation: conversationId,
          idUser: userId,
          content: content,
          type: type || "text"
        });

        // update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: content,
          lastMessageAt: new Date()
        });

        // populate user
        message = await message.populate("idUser", "name");

        // gửi realtime
        io.to(conversationId).emit("newMessage", message);

      } catch (err) {
        console.error("Send message error:", err);
      }

    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};