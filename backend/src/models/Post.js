import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  location: {
    block: String,
    floor: String,
    room: String
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
