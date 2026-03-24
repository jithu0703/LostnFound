import express from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  deleteUser,loginUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);

router.get('/:id', getUserById);


router.post('/', addUser);

router.post('/login', loginUser); 

router.delete('/:id', deleteUser);


export default router;