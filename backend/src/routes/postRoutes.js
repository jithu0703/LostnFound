import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.delete('/:id', protect, deletePost);
router.post(
  '/',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  createPost
);

export default router;
