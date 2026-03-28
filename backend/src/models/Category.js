import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: String
});

export default mongoose.model("Category", categorySchema);
