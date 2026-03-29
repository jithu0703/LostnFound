import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
//import bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('API running...');
});

export default app;