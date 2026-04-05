import express from "express";
import {
  adminLogin,
  adminGetPosts,
  adminDeletePost,
  seedAdmin,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public
router.post("/login", adminLogin);
router.post("/seed", seedAdmin); // one-time admin creation (protected by ADMIN_SEED_SECRET)

// Protected — admin token required
router.get("/posts", protectAdmin, adminGetPosts);
router.delete("/posts/:id", protectAdmin, adminDeletePost);

export default router;