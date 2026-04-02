import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import messageRoutes from "./routes/messageRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('API running...');
});

export default app;