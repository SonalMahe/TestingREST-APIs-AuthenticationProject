import '../styles/Hero.css';

function Hero({ onLogin }) {
  return (
    <div className="hero">
      <h2>Discover & Review Books</h2>
      <p>Browse the collection — sign in to add books and share your reviews</p>
      <button className="btn btn-primary" onClick={onLogin}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Hero;
