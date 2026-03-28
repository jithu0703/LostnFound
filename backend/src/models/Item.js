import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  room_no: Number,
  floor: Number,
  block: String,
  datePosted: Date,

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

export default mongoose.model("Item", itemSchema);