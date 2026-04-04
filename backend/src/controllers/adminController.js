import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Post from "../models/Post.js";

// ── Admin Login ──────────────────────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during admin login" });
  }
};

// ── Get All Posts (admin view) ───────────────────────────────────────────────
export const adminGetPosts = async (req, res) => {
  try {
    const { search, type } = req.query;
    let filter = {};
    if (type) filter.type = type;
    if (search) filter.itemName = { $regex: search, $options: "i" };

    const posts = await Post.find(filter)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// ── Admin Delete Any Post ────────────────────────────────────────────────────
export const adminDeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted by admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

// ── Seed Admin (one-time setup) ──────────────────────────────────────────────
export const seedAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await Admin.countDocuments();

    const newAdmin = new Admin({
      adminId: count + 1,
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully", admin: { email, name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating admin" });
  }
};