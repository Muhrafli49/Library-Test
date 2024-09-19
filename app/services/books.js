const Book = require('../api/books/model');
const { NotFoundError } = require('../errors/index');


const getAvailableBooks = async () => {
    const books = await Book.find({ stock: { $gt: 0 } });

    if (!books) throw new NotFoundError('No available books found');

    return books;
};

module.exports = {
    getAvailableBooks
};
