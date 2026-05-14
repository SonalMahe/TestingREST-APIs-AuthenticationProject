import { useState, useEffect } from 'react';
import { onAuthChange, loginWithGoogle } from './services/auth.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import BookList from './components/BookList.jsx';
import './styles/main.css';

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
      <Header user={user} onLogin={handleLogin} />
      {!user && <Hero onLogin={handleLogin} />}
      {authError && <div className="banner error-banner">{authError}</div>}
      <main>
        <BookList user={user} />
      </main>
    </div>
  );
}

export default App;
