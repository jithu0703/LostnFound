import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  },
  messageText: String,
  date: Date
});

export default mongoose.model("Message", messageSchema);
