import { useState } from 'react';
import AddReviewForm from './AddReviewForm.jsx';
import { api } from '../services/api.js';

function BookCard({ book, user, onUpdate }) {
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: book.title, author: book.author, genre: book.genre });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!confirm(`Delete "${book.title}"?`)) return;
    setLoading(true);
    try {
      await api.delete(`/books/${book.id}`);
      onUpdate();
    } catch {
      setError('Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.put(`/books/${book.id}`, editForm);
      setEditing(false);
      onUpdate();
    } catch {
      setError('Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-card">
      {editing ? (
        <form className="edit-form" onSubmit={handleUpdate}>
          <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
          <input value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} required />
          <input value={editForm.genre} onChange={e => setEditForm({ ...editForm, genre: e.target.value })} required />
          {error && <p className="error-text">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="book-header">
            <h3>{book.title}</h3>
            <span className="genre-badge">{book.genre}</span>
          </div>
          <p className="author">by {book.author}</p>

          <div className="book-footer">
            <button className="btn btn-sm" onClick={() => setShowReviews(!showReviews)}>
              {showReviews ? 'Hide' : '📖 Reviews'} ({book.reviews.length})
            </button>
            {user && (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? 'Cancel' : '+ Review'}
                </button>
                <button className="btn btn-sm btn-edit" onClick={() => setEditing(true)}>✏️</button>
                <button className="btn btn-sm btn-delete" onClick={handleDelete} disabled={loading}>🗑️</button>
              </>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}
        </>
      )}

      {showReviews && (
        <div className="reviews">
          {book.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet.</p>
          ) : (
            book.reviews.map((review, i) => (
              <div key={i} className="review-item">
                <span className="stars">{'⭐'.repeat(review.rating)}</span>
                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      {showReviewForm && (
        <AddReviewForm
          bookId={book.id}
          onReviewAdded={() => { setShowReviewForm(false); onUpdate(); }}
        />
      )}
    </div>
  );
}

export default BookCard;
