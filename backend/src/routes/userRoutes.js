import express from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  deleteUser, loginUser, getMe
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);


export default router;