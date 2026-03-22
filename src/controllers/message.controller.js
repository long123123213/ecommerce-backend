const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.sendMessage = async (req, res) => {

  try {

    const io = req.app.get("io");

    const userId = req.user.id;
    const { conversationId, content, type } = req.body;

    let message = await Message.create({
      idConversation: conversationId,
      idUser: userId,
      content,
      type
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date()
    });

    message = await message.populate("idUser", "name");

    io.to(conversationId).emit("newMessage", message);

    res.json(message);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};

exports.getMessages = async (req, res) => {

  try {

    const { conversationId } = req.params;

    const messages = await Message.find({
      idConversation: conversationId
    })
      .populate("idUser", "name")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};

exports.markAsRead = async (req, res) => {

  try {

    const { conversationId } = req.params;

    await Message.updateMany(
      {
        idConversation: conversationId,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.json({ message: "Messages marked as read" });

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};