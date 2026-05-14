import express from 'express';
import cors from 'cors';
import bookroutes from './routes/books.js';
import { verifyToken } from './middleware/verifytoken.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/books', bookroutes);

app.get('/api/profile', verifyToken, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email, name: req.user.name });
});

export default app;
