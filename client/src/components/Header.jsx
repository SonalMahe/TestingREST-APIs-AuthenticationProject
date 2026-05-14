import { logout } from '../services/auth.js';
import '../styles/Header.css';

function Header({ user, onLogin }) {
  return (
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
          <button className="btn btn-google" onClick={onLogin}>
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
