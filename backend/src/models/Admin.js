import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  adminId: Number,
  name: String,
  email: String,
  password: String
});

export default mongoose.model("Admin", adminSchema);