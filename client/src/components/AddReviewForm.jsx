import { useState } from 'react';
import { api } from '../services/api.js';
import '../styles/components/AddReviewForm.css';

function AddReviewForm({ bookId, onReviewAdded }) {
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/books/${bookId}/reviews`, form);
      setForm({ rating: 5, comment: '' });
      onReviewAdded();
    } catch (err) {
      setError(err.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {error && <p className="error-text">{error}</p>}
      <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
      </select>
      <input
        placeholder="Write a comment..."
        value={form.comment}
        onChange={e => setForm({ ...form, comment: e.target.value })}
        required
      />
      <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}

export default AddReviewForm;
