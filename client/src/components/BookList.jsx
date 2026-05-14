import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import BookCard from './BookCard.jsx';
import AddBookForm from './AddBookForm.jsx';
import '../styles/components/BookList.css';

function BookList({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/books');
      setBooks(data);
    } catch {
      setError('Failed to load books. Make sure the backend server is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  return (
    <div className="book-list">
      <div className="list-header">
        <h2>All Books {!loading && `(${books.length})`}</h2>
        {user && <AddBookForm onBookAdded={fetchBooks} />}
      </div>

      {!user && (
        <div className="login-notice">
          🔒 Log in with Google to add books and write reviews
        </div>
      )}

      {loading && <div className="state-box">Loading books...</div>}
      {error && <div className="state-box error-box">{error}</div>}

      {!loading && !error && (
        <div className="books-grid">
          {books.map(book => (
            <BookCard key={book.id} book={book} user={user} onUpdate={fetchBooks} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;
