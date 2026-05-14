import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Replace real Firebase auth with a fake — no real login/logout
vi.mock('../services/auth.js', () => ({
  logout: vi.fn(),
  loginWithGoogle: vi.fn(),
  onAuthChange: vi.fn(),
  getToken: vi.fn(() => Promise.resolve(null)),
}));

// Replace real API calls with a fake — no real network requests
vi.mock('../services/api.js', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import Header from '../components/Header.jsx';
import BookList from '../components/BookList.jsx';
import { api } from '../services/api.js';

// ── Header tests ──────────────────────────────────────────────
describe('Header', () => {
  test('shows login button when user is not logged in', () => {
    render(<Header user={null} onLogin={() => {}} />);

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  test('shows username when user is logged in', () => {
    const fakeUser = { displayName: 'Sonal', photoURL: null };
    render(<Header user={fakeUser} onLogin={() => {}} />);

    expect(screen.getByText('Sonal')).toBeInTheDocument();
  });

  test('shows logout button when user is logged in', () => {
    const fakeUser = { displayName: 'Sonal', photoURL: null };
    render(<Header user={fakeUser} onLogin={() => {}} />);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});

// ── BookList tests ────────────────────────────────────────────
describe('BookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('hides Add Book button when user is not logged in', async () => {
    api.get.mockResolvedValue([]);
    render(<BookList user={null} />);

    await waitFor(() => {
      expect(screen.queryByText('+ Add Book')).not.toBeInTheDocument();
    });
  });

  test('shows list of books when data is returned from API', async () => {
    api.get.mockResolvedValue([
      { id: 1, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Tech', reviews: [] },
      { id: 2, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', reviews: [] },
    ]);
    render(<BookList user={null} />);

    await waitFor(() => {
      expect(screen.getByText('Clean Code')).toBeInTheDocument();
      expect(screen.getByText('Atomic Habits')).toBeInTheDocument();
    });
  });

  test('shows error message when API fails', async () => {
    api.get.mockRejectedValue(new Error('Server not running'));
    render(<BookList user={null} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load books/i)).toBeInTheDocument();
    });
  });

  test('shows not logged in notice when user is not logged in', async () => {
    api.get.mockResolvedValue([]);
    render(<BookList user={null} />);

    await waitFor(() => {
      expect(screen.getByText(/Log in with Google/i)).toBeInTheDocument();
    });
  });
});
