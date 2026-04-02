import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get chat messages between two users for a post
router.get("/:postId/:userId", protect, getMessages);

export default router;