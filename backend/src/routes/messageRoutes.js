import express from "express";
import { getMessages, getConversations, getUnreadCount, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage); //send a message
router.get("/conversations", protect, getConversations); //get a convo
router.get("/unreadCount", protect, getUnreadCount);    //get unread msgs
router.get("/:postId/:userId", protect, getMessages);   //get a msg

export default router;