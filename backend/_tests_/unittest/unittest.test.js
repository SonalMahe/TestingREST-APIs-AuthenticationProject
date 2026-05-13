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

  test('returns null for invalid book id', () => {
    const result = addReview(999, {
      rating: 5,
      comment: 'Great'
    });

    expect(result).toBeNull();
  });
});