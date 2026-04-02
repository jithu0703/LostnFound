import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { postId, userId } = req.params;

    const messages = await Message.find({
      postId,
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};