import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,   // ✅ must be provided
    unique: true      // ✅ no duplicate categories
  }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);