import express from 'express';
import cors from 'cors';
import bookroutes from './routes/books.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5500',     
    credentials: true,      
}));

app.use(express.json());
app.use('/api/books', bookroutes);

export default app;     
