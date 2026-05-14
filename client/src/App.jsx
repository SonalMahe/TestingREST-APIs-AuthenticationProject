import { useState, useEffect } from 'react';
import { onAuthChange, loginWithGoogle, logout } from './services/auth.js';
import BookList from './components/BookList.jsx';
import './styles/main.css';
import './styles/Header.css';
import './styles/Hero.css';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch {
      setAuthError('Login failed. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className="fullscreen-center">
        <p>📚 Loading Bookstore...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">📚</span>
          <h1>Bookstore</h1>
        </div>
        <div className="header-right">
          {user ? (
            <>
              {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="avatar" />}
              <span className="username">{user.displayName}</span>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-google" onClick={handleLogin}>
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      {!user && (
        <div className="hero">
          <h2>Discover & Review Books</h2>
          <p>Browse the collection — sign in to add books and share your reviews</p>
          <button className="btn btn-primary" onClick={handleLogin}>
            Sign in with Google
          </button>
        </div>
      )}

      {authError && <div className="banner error-banner">{authError}</div>}

      <main>
        <BookList user={user} />
      </main>
    </div>
  );
}

export default App;
