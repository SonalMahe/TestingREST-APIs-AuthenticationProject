let books = [
  { id: 1, title: 'The Ramayan', author: 'Valmiki', genre: 'Hindu Epic', reviews: [ { id: 1, text: 'Great book!' } ] },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', reviews: [] },
  { id: 3, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', reviews: [] },
  { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', reviews: [] },
  { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', reviews: [] },
  { id: 6, title: 'The Ramayan', author: 'Valmiki', genre: 'Hindu Epic', reviews: [] },
  { id: 7, title: 'The Mahabharata', author: 'Vyasa', genre: 'Hindu Epic', reviews: [] },
  { id: 8, title: 'Bhagavad Gita', author: 'Vyasa', genre: 'Spiritual', reviews: [] },
  { id: 9, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', reviews: [] },
  { id: 10, title: 'Harry Potter and the Sorcerer Stone', author: 'J.K. Rowling', genre: 'Fantasy', reviews: [] },
  { id: 11, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', reviews: [] }
];

let nextId = 12;

export function getAllBooks() {
  return books;
}

export function getBookById(id) {
  return books.find(b => b.id === parseInt(id));
}

export function addBook({ title, author, genre }) {
  const book = { id: nextId++, title, author, genre, reviews: [] };
  books.push(book);
  return book;
}

export function addReview(bookId, review) {
  const book = getBookById(bookId);
  if (!book) return null;
  book.reviews.push(review);
  return book;
}

export function resetStore() {
  books = [
    { id: 1, title: 'The Ramayan', author: 'Valmiki', genre: 'Hindu Epic', reviews: [] },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', reviews: [] },
    { id: 3, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', reviews: [] },
    { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', reviews: [] },
    { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', reviews: [] },
    { id: 6, title: 'The Ramayan', author: 'Valmiki', genre: 'Hindu Epic', reviews: [] },
    { id: 7, title: 'The Mahabharata', author: 'Vyasa', genre: 'Hindu Epic', reviews: [] },
    { id: 8, title: 'Bhagavad Gita', author: 'Vyasa', genre: 'Spiritual', reviews: [] },
    
  ];
  nextId = 9;
}
