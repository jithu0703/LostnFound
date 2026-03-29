import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.delete('/:id', protect, deletePost);

export default router;
