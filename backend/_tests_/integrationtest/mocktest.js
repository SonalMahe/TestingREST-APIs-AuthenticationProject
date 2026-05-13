
import app from '../../src/app.js';
import { resetStore } from '../../src/data/store.js';
import http from 'node:http';

// vi.mock is hoisted by Vitest — runs before any import below
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



let server;
let port;

// Start a real HTTP server before all tests
beforeAll(() => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});



// Close the server after all tests
afterAll(() => {
  return new Promise((resolve) => server.close(resolve));
});

// Reset in-memory data before each test so tests don't affect each other
beforeEach(() => {
  resetStore();
});


// Helper function to make HTTP requests to our server-
export function request(method, path, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body ? JSON.stringify(options.body) : null;

    const headers = {
      'Content-Type': 'application/json'
    };

    if (options.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path,
        method,
        headers
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        });
      }
    );

    req.on('error', reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}