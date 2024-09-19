import Book from '../app/api/books/model';
import Member from '../app/api/members/model';

// Remove all test books
export const removeAllTestBooks = async () => {
    await Book.deleteMany({});
};

// Create a test book
export const createTestBook = async (code = "TW-11", title = "Twilight", author = "Stephenie Meyer", stock = 5) => {
    return await Book.create({
        code,
        title,
        author,
        stock
    });
};

// Remove all test members
export const removeAllTestMembers = async () => {
    await Member.deleteMany({});
};

// Create a test member
export const createTestMember = async (code = "M003", name = "Putri", borrowedBooks = []) => {
    return await Member.create({
        code,
        name,
        borrowedBooks
    });
};

// Function to borrow a book for a test member
export const borrowBookForMember = async (memberId, bookId) => {
    const member = await Member.findById(memberId).populate({
        path: 'borrowedBooks.book',
        select: 'title'
    }).select('-__v');

    if (!member) throw new Error('Member not found');

    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book not found');

    if (book.stock <= 0) throw new Error('Book is currently unavailable');

    if (member.borrowedBooks.length >= 2) throw new Error('Member has already borrowed 2 books');

    const alreadyBorrowed = member.borrowedBooks.some(borrowedBook => borrowedBook.book._id.equals(bookId));
    if (alreadyBorrowed) throw new Error('Member already borrowed this book');

    member.borrowedBooks.push({
        book: book._id,
        borrowDate: new Date()
    });
    book.stock -= 1;

    await member.save();
    await book.save();
};

// Function to return a book for a test member
export const returnBookForMember = async (memberId, bookId, returnDate = new Date()) => {
    const member = await Member.findById(memberId).populate('borrowedBooks.book').select('-__v');
    if (!member) throw new Error('Member not found');

    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book not found');

    const borrowedBookIndex = member.borrowedBooks.findIndex(b => b.book._id.equals(bookId));
    if (borrowedBookIndex === -1) throw new Error('Book not borrowed by this member');

    const borrowedDate = new Date(member.borrowedBooks[borrowedBookIndex].borrowDate);
    const daysBorrowed = Math.floor((returnDate - borrowedDate) / (1000 * 60 * 60 * 24));

    member.borrowedBooks.splice(borrowedBookIndex, 1);
    book.stock += 1;

    if (daysBorrowed > 7) {
        member.penalty = true;
        member.penaltyEndDate = new Date(returnDate.getTime() + (3 * 24 * 60 * 60 * 1000)); 
    } else {
        member.penalty = false;
        member.penaltyEndDate = null; 
    }

    await member.save();
    await book.save();

    return {
        member,
        returnedBook: {
            code: book.code,
            title: book.title
        }
    };
};
