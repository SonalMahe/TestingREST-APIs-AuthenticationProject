import { describe, test, expect, beforeEach } from 'vitest';
import {
  getAllBooks,
  getBookById,
  addBook,
  addReview,
  resetStore
} from '../../src/data/store.js';


// Reset data before each test
beforeEach(() => {
  resetStore();
});

// Unit tests for store functions-
describe('getAllBooks', () => {
  test('returns all books', () => {
    const books = getAllBooks();

    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
  });

  test('each book has required fields', () => {
    const books = getAllBooks();

    books.forEach(book => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('genre');
      expect(book).toHaveProperty('reviews');
    });
  });
});


// Unit tests for getBookById functions-
describe('getBookById', () => {
  test('returns correct book by id', () => {
    const book = getBookById(1);

    expect(book.id).toBe(1);
  });

  test('returns undefined for invalid id', () => {
    const book = getBookById(999);

    expect(book).toBeUndefined();
  });
});

// Unit tests for addBook functions-
describe('addBook', () => {
  test('adds a new book', () => {
    const newBook = addBook({
      title: 'New Book',
      author: 'Author',
      genre: 'Fiction'
    });

    expect(newBook.title).toBe('New Book');
    expect(newBook).toHaveProperty('id');
  });

  test('added book can be retrieved by id', () => {
    const newBook = addBook({ title: 'Test Book', author: 'Tester', genre: 'Drama' });
    const found = getBookById(newBook.id);

    expect(found).toBeDefined();
    expect(found.title).toBe('Test Book');
  });

  test('each new book gets a unique id', () => {
    const book1 = addBook({ title: 'Book A', author: 'Author A', genre: 'Fiction' });
    const book2 = addBook({ title: 'Book B', author: 'Author B', genre: 'Fiction' });

    expect(book1.id).not.toBe(book2.id);
  });
});


// Unit tests for addReview function-
describe('addReview', () => {
  test('adds review to existing book', () => {
    const updatedBook = addReview(1, {
      rating: 5,
      comment: 'Excellent'
    });

    expect(updatedBook.reviews.length).toBe(1);
  });

  test('review contains correct data', () => {
    const updatedBook = addReview(1, { rating: 4, comment: 'Good read' });
    const review = updatedBook.reviews[0];

    expect(review.rating).toBe(4);
    expect(review.comment).toBe('Good read');
  });

  test('multiple reviews can be added to same book', () => {
    addReview(1, { rating: 5, comment: 'First review' });
    const updatedBook = addReview(1, { rating: 3, comment: 'Second review' });

    expect(updatedBook.reviews.length).toBe(2);
  });

  test('returns null for invalid book id', () => {
    const result = addReview(999, {
      rating: 5,
      comment: 'Great'
    });

    expect(result).toBeNull();
  });
});