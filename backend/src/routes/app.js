import express from 'express';
import cors from 'cors';
import bookroutes from './routes/app.js';

const app = express();
const PORT = process.env.PORT || 3000;