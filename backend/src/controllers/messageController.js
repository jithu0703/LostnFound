import Message from "../models/Message.js";
import mongoose from "mongoose";

// Send a new message (HTTP fallback or direct)
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, postId, messageText } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !postId || !messageText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      postId,
      messageText,
      isRead: false
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Get a list of all conversations for the current user
export const getConversations = async (req, res) => {
  try {
    const myId = req.user._id;

    // Aggregation to find unique (otherUser, postId) pairs
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: myId }, { receiverId: myId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            postId: "$postId",
            otherUser: {
              $cond: [
                { $eq: ["$senderId", myId] },
                "$receiverId",
                "$senderId"
              ]
            }
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", myId] },
                    { $eq: ["$isRead", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.otherUser",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id.postId",
          foreignField: "_id",
          as: "postInfo"
        }
      },
      {
        $unwind: "$postInfo"
      },
      {
        $project: {
          _id: 0,
          postId: "$_id.postId",
          otherUser: {
            _id: "$userInfo._id",
            name: "$userInfo.name"
          },
          postTitle: "$postInfo.itemName",
          postImage: "$postInfo.imageUrl",
          lastMessageText: "$lastMessage.messageText",
          lastMessageDate: "$lastMessage.createdAt",
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageDate: -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
};

// Get unread count for Navbar notification dot
export const getUnreadCount = async (req, res) => {
  try {
    const myId = req.user._id;
    const count = await Message.countDocuments({
      receiverId: myId,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching unread count" });
  }
};

// Get message history and mark as read
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { postId, userId } = req.params;

    // Fetch messages
    const messages = await Message.find({
      postId,
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      {
        postId,
        senderId: userId,
        receiverId: myId,
        isRead: false
      },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};