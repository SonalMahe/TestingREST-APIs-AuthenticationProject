import {Router} from 'express';
import{verifyToken} from '../middleware/authMiddleware.js';
import {getBooks, getBookById, createBook, updateBook, deleteBook} from '../controllers/bookController.js';

const router = Router();