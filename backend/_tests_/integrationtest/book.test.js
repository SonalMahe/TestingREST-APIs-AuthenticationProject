import { describe, test, expect,  beforeAll, beforeEach, afterAll, vi} from "vitest";
import { request } from './mocktest.js';

//Test GET /books endpoint returns all books successfully
describe('GET /books', () => {
  test('returns all books', async () => {
    const { status, body } = await request('GET', '/books');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });
});


//Test GET /books/:id endpoint returns correct book or 404 for invalid id
describe('GET /books/:id', () => {
  test('returns one book by id', async () => {
    const { status, body } = await request('GET', '/books/1');

    expect(status).toBe(200);
    expect(body.id).toBe(1);
  });
  
//Test GET /books/:id with invalid id returns 404
  test('returns 404 for invalid book id', async () => {
    const { status } = await request('GET', '/books/999');

    expect(status).toBe(404);
  });
});


//Test POST /books endpoint requires auth and adds book with valid token
describe('POST /books', () => {
  test('returns 401 without token', async () => {
    const { status } = await request('POST', '/books', {
      body: {
        title: 'New Book',
        author: 'Author',
        genre: 'Fiction'
      }
    });

    expect(status).toBe(401);
  });
//Test adding book with valid token
  test('adds a new book with valid token', async () => {
    const { status, body } = await request('POST', '/books', {
      token: 'valid-test-token',
      body: {
        title: 'New Book',
        author: 'Author',
        genre: 'Fiction'
      }
    });

    expect(status).toBe(201);
    expect(body.title).toBe('New Book');
  });
});


//Test POST /books/:id/reviews endpoint requires auth and adds review with valid token
describe('POST /books/:id/reviews', () => {
  test('returns 401 without token for review', async () => {
    const { status } = await request('POST', '/books/1/reviews', {
      body: {
        rating: 5,
        comment: 'Great book'
      }
    });

    expect(status).toBe(401);
  });
//Test adding review with valid token
  test('adds review with valid token', async () => {
    const { status, body } = await request('POST', '/books/1/reviews', {
      token: 'valid-test-token',
      body: {
        rating: 5,
        comment: 'Amazing book'
      }
    });

    expect(status).toBe(201);
    expect(body.reviews.length).toBeGreaterThan(0);
  });
});