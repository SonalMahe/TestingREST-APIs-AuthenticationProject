# Bookstore REST API

A Node.js/Express REST API for managing books and reviews, secured with Firebase Authentication, tested with Vitest, and automated with GitHub Actions CI.

---

## Project Structure

```
TestingREST-APIs-AuthenticationProject/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── books.js          # API route handlers
│   │   ├── middleware/
│   │   │   └── verifytoken.js    # Firebase token verification
│   │   ├── data/
│   │   │   └── store.js          # In-memory data store
│   │   └── app.js                # Express app setup
│   ├── _tests_/
│   │   ├── unittest/
│   │   │   └── unittest.test.js  # Unit tests for store functions
│   │   └── integrationtest/
│   │       ├── book.test.js      # Integration tests for API routes
│   │       └── mocktest.js       # Test server + request helper
│   ├── .env.example              # Environment variable template
│   ├── vitest.config.js
│   ├── index.js                  # Server entry point
│   └── package.json
│
├── client/
│   └── src/
│       └── firebase/
│           └── firebase.init.js  # Firebase client SDK setup
│
└── README.md
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/SonalMahe/TestingREST-APIs-AuthenticationProject.git
cd TestingREST-APIs-AuthenticationProject
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Fill in `backend/.env` with your Firebase service account values:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5500

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

> Get these values from: Firebase Console → Project Settings → Service Accounts → Generate new private key

For the frontend, create `client/.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Run locally

```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

### API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/books` | — | Get all books |
| GET | `/api/books/:id` | — | Get book by ID |
| POST | `/api/books` | -| Add a new book |
| POST | `/api/books/:id/reviews` | -| Add a review |

Protected routes require a Firebase ID token in the header:
```
Authorization: Bearer <firebase-id-token>
```

---

## Testing

### Run tests

```bash
cd backend
npm test
```

### Unit Tests — `_tests_/unittest/unittest.test.js`

Test the data store functions directly, no HTTP involved. **13 tests total.**

| Test | Verifies |
|------|----------|
| `getAllBooks` returns all books | Returns a non-empty array |
| `getAllBooks` each book has required fields | Every book has id, title, author, genre, reviews |
| `getBookById` returns correct book | Finds book by ID |
| `getBookById` returns undefined for invalid ID | Handles missing book gracefully |
| `addBook` adds a new book | Creates book with correct fields and ID |
| `addBook` added book can be retrieved by id | Store is updated after adding |
| `addBook` each new book gets a unique id | Auto-increment works correctly |
| `addReview` adds review to existing book | Appends review to book's reviews array |
| `addReview` review contains correct data | Review fields match input |
| `addReview` multiple reviews can be added | Reviews accumulate correctly |
| `addReview` returns null for invalid book ID | Returns null for non-existent book |

### Integration Tests — `_tests_/integrationtest/book.test.js`

Spins up a real HTTP server and tests full request/response cycles. Firebase Admin is **fully mocked** — no real credentials needed. **10 tests total.**

| Test | Expected |
|------|----------|
| `GET /api/books` returns all books | `200` + array |
| `GET /api/books` each book has required fields | All books have correct structure |
| `GET /api/books/:id` valid ID | `200` + book object |
| `GET /api/books/:id` invalid ID | `404` |
| `POST /api/books` — no token | `401` |
| `POST /api/books` — valid token | `201` + new book |
| `POST /api/books` — missing fields | `400` |
| `POST /api/books` created book has all required fields | Response has correct structure |
| `POST /api/books/:id/reviews` — no token | `401` |
| `POST /api/books/:id/reviews` — valid token | `201` + updated book |
| `POST /api/books/:id/reviews` — missing fields | `400` |
| `POST /api/books/:id/reviews` — non-existent book | `404` |

### Screenshot — local tests passing

![Local tests passing](backend/docs/localpassedtest.png)

### Screenshot — GitHub Actions pipeline passing

![GitHub Actions pipeline passing](backend/docs/passedtest.png)

---

## Authentication

**Provider: Firebase Authentication**

| | |
|---|---|
| **Why Firebase** | Built-in JWT verification via Admin SDK — no custom token logic needed |
| **Frontend** | Firebase client SDK handles sign-in and provides an ID token (valid 1 hour) |
| **Backend** | `verifyToken` middleware calls `admin.auth().verifyIdToken()` on every protected request |
| **On success** | Decoded user is attached to `req.user`, request continues |
| **On failure** | Immediately returns `401 Unauthorized` |

---

## Security Decisions

| Decision | Why |
|----------|-----|
| **Secrets in `.env`, not in code** | Prevents credentials being committed to version control. `.env` is in `.gitignore`; `.env.example` provides the template with placeholder values only. |
| **Token verified on every request** | Stateless verification — no server-side sessions. If a token is revoked (user deleted, password reset), the next request is rejected immediately. |
| **Tokens not stored in `localStorage`** | `localStorage` is readable by any JS on the page. XSS attacks can steal tokens stored there. Firebase SDK manages tokens in memory/IndexedDB instead. |
| **CORS restricted to one origin** | Only requests from the configured `CORS_ORIGIN` are accepted. Prevents other websites from making authenticated requests using a visitor's credentials. |
| **`firebase-admin` backend only** | The Admin SDK bypasses all Firebase security rules. It must never be included in frontend code or exposed to the browser. |
| **Firebase init via env vars, not key file** | Key files can be accidentally committed. Environment variables are injected at runtime by the host (locally via `.env`, in CI via GitHub Secrets). |

---

## Reflections

### Implementation choices

- **Vitest** — Natively supports ES modules (`"type": "module"`). Jest requires Babel/transform config for ESM; Vitest works out of the box and runs faster.
- **In-memory store** — Keeps the project focused on auth and testing. A real project would swap `store.js` for a database layer.
- **Mocking Firebase in tests** — `vi.mock('firebase-admin')` makes tests fast, deterministic, and runnable in CI with no real credentials.
- **`resetStore()` in `beforeEach`** — Ensures every test starts with a clean state and results don't depend on execution order.

### Challenges

- `vi.mock` must be declared inside the test file (not a helper) because Vitest only hoists mocks within the file that declares them.
- Firebase Admin initialises when `app.js` is imported — the mock must be set up before any import that triggers that chain.

### What we would do differently

- Add `.gitignore` for key files *before* generating them, so they can never be accidentally committed.
- Set up the GitHub Actions workflow at the start so the pipeline is green from day one.
- Use a validation library (e.g. `zod`) instead of manual `if (!title)` checks in route handlers.
