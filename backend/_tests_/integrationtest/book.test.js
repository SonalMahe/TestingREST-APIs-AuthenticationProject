import { describe, test, expect, vi } from "vitest";
import { request } from './mocktest.js';

// vi.mock is hoisted by Vitest — must be in the test file, not a helper
vi.mock('firebase-admin', () => ({
  default: {
    apps: [],
    initializeApp: vi.fn(),
    credential: { cert: vi.fn(() => ({})) },
    auth: vi.fn(() => ({
      verifyIdToken: vi.fn(async (token) => {
        if (token === 'valid-test-token') {
          return { uid: 'user-123', email: 'test@example.com', name: 'Test User' };
        }
        throw new Error('Firebase: Invalid ID token');
      })
    }))
  }
}));



// Authentication failure tests
describe('Authentication', () => {
  test('rejects request with invalid token', async () => {
    const { status } = await request('POST', '/api/books', {
      token: 'invalid-token-xyz',
      body: { title: 'Test', author: 'Test', genre: 'Test' }
    });
    expect(status).toBe(401);
  });


  //Test POST /api/books endpoint requires auth
  test('rejects request with no token', async () => {
    const { status } = await request('POST', '/api/books', {
      body: { title: 'Test', author: 'Test', genre: 'Test' }
    });
    expect(status).toBe(401);
  });


//Test POST /api/books endpoint allows valid token
  test('allows request with valid token', async () => {
    const { status } = await request('POST', '/api/books', {
      token: 'valid-test-token',
      body: { title: 'Test', author: 'Test', genre: 'Test' }
    });
    expect(status).toBe(201);
  });
});

//Test GET /api/books endpoint returns all books successfully
describe('GET /api/books', () => {
  test('returns all books', async () => {
    const { status, body } = await request('GET', '/api/books');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });


//Test GET /api/books endpoint returns books with required fields
  test('each book has required fields', async () => {
    const { body } = await request('GET', '/api/books');

    body.forEach(book => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('genre');
      expect(book).toHaveProperty('reviews');
    });
  });
});


//Test GET /api/books/:id endpoint returns correct book or 404 for invalid id
describe('GET /api/books/:id', () => {
  test('returns one book by id', async () => {
    const { status, body } = await request('GET', '/api/books/1');

    expect(status).toBe(200);
    expect(body.id).toBe(1);
  });

//Test GET /api/books/:id with invalid id returns 404
  test('returns 404 for invalid book id', async () => {
    const { status } = await request('GET', '/api/books/999');

    expect(status).toBe(404);
  });
});


//Test POST /api/books endpoint requires auth and adds book with valid token
describe('POST /api/books', () => {
  test('returns 401 without token', async () => {
    const { status } = await request('POST', '/api/books', {
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
    const { status, body } = await request('POST', '/api/books', {
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

//Test adding book with missing fields returns 400
  test('returns 400 when required fields are missing', async () => {
    const { status } = await request('POST', '/api/books', {
      token: 'valid-test-token',
      body: { title: 'No Author or Genre' }
    });

    expect(status).toBe(400);
  });
//Test created book has all required fields
  test('created book has all required fields', async () => {
    const { body } = await request('POST', '/api/books', {
      token: 'valid-test-token',
      body: { title: 'Full Book', author: 'Someone', genre: 'Drama' }
    });

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('author');
    expect(body).toHaveProperty('genre');
    expect(body).toHaveProperty('reviews');
  });
});


//Test GET /api/profile endpoint requires auth and returns user data
describe('GET /api/profile', () => {
  test('returns 401 without token', async () => {
    const { status } = await request('GET', '/api/profile');

    expect(status).toBe(401);
  });

  test('returns user profile with valid token', async () => {
    const { status, body } = await request('GET', '/api/profile', {
      token: 'valid-test-token'
    });

    expect(status).toBe(200);
    expect(body).toHaveProperty('uid');
    expect(body).toHaveProperty('email');
  });
});


//Test POST /api/books/:id/reviews endpoint requires auth and adds review with valid token
describe('POST /api/books/:id/reviews', () => {
  test('returns 401 without token for review', async () => {
    const { status } = await request('POST', '/api/books/1/reviews', {
      body: {
        rating: 5,
        comment: 'Great book'
      }
    });

    expect(status).toBe(401);
  });

  //Test adding review with valid token
  test('adds review with valid token', async () => {
    const { status, body } = await request('POST', '/api/books/1/reviews', {
      token: 'valid-test-token',
      body: {
        rating: 5,
        comment: 'Amazing book'
      }
    });

    expect(status).toBe(201);
    expect(body.reviews.length).toBeGreaterThan(0);
  });

  //Test adding review with missing fields returns 400
  test('returns 400 when required fields are missing', async () => {
    const { status } = await request('POST', '/api/books/1/reviews', {
      token: 'valid-test-token',
      body: { rating: 5 }
    });

    expect(status).toBe(400);
  });

  test('returns 404 for non-existent book', async () => {
    const { status } = await request('POST', '/api/books/999/reviews', {
      token: 'valid-test-token',
      body: { rating: 5, comment: 'Great' }
    });

    expect(status).toBe(404);
  });
});
