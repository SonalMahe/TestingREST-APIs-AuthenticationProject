import { useState } from 'react';
import { api } from '../services/api.js';

function AddBookForm({ onBookAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', genre: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/books', form);
      setForm({ title: '', author: '', genre: '' });
      setOpen(false);
      onBookAdded();
    } catch (err) {
      setError(err.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        + Add Book
      </button>
    );
  }

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <h3>Add New Book</h3>
      {error && <p className="error-text">{error}</p>}
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
      />
      <input
        placeholder="Author"
        value={form.author}
        onChange={e => setForm({ ...form, author: e.target.value })}
        required
      />
      <input
        placeholder="Genre"
        value={form.genre}
        onChange={e => setForm({ ...form, genre: e.target.value })}
        required
      />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
        <button type="button" className="btn" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddBookForm;
