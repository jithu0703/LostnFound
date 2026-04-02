import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true   
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"] 
  },
  password: {
    type: String,
    required: true,
    minlength: 7   
  },
  phone: {
    type: String,
    required: true,
    unique: true,   
    match: [/^[0-9]{10}$/, "Enter valid 10-digit phone number"] 
  }
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);