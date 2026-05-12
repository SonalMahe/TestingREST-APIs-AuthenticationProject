let books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'David Thomas', genre: 'Technology', reviews: [] },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', reviews: [] },
  { id: 3, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', reviews: [] }
];

let nextId = 4;

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
    { id: 1, title: 'The Pragmatic Programmer', author: 'David Thomas', genre: 'Technology', reviews: [] },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', reviews: [] },
    { id: 3, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', reviews: [] }
  ];
  nextId = 4;
}
