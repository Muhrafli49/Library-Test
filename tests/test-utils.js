import Book from '../app/api/books/model';

// Remove all test books
export const removeAllTestBooks = async () => {
    await Book.deleteMany({});
};

// Create a test book
export const createTestBook = async () => {
    await Book.create({
        code: "B001",
        title: "Test Book",
        author: "Test Author",
        stock: 5
    });
};

