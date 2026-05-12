import {Router} from 'express';
import{verifyToken} from '../middleware/authMiddleware.js';
import {getBooks, getBookById, createBook, updateBook, deleteBook} from '../controllers/bookController.js';

const router = Router();

//public routes-anyone can read books
router.get('/', (req,res)=>{
    res.json({message: 'Welcome to the Book API!'});        
});

router.get('/:id', (req, res) => {
  const book = getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

//protected-must be logged in 
router.post('/', verifyToken, (req, res) => {
    const{title, author ,genre } = req.body;
    if (!title || !author || !genre) {
    return res.status(400).json({ error: 'Title, author, and genre are required' });
  }
  const book = addBook({ title, author, genre });
  res.status(201).json(book);
});

router.post('/:id/reviews', verifyToken, (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }
  const book = addReview(req.params.id, { rating, comment, userId: req.user.uid });
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.status(201).json(book);
});

export default router;
