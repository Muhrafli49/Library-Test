const Book = require('../api/books/model');
const Member = require('../api/members/model');
const { BadRequestError, NotFoundError } = require('../errors/index');


const borrowBook = async (memberId, bookId) => {
    const member = await Member.findById(memberId)
        .populate({
            path: 'borrowedBooks.book',
            select: 'title'
        })
        .select('-__v');
    if (!member) throw new NotFoundError('Member not found');

    // Cek apakah member sedang dalam penalti
    if (member.penalty && member.penaltyEndDate && new Date() > member.penaltyEndDate) {
        member.penalty = false;
        member.penaltyEndDate = null;
    }

    if (member.penalty && member.penaltyEndDate > new Date()) {
        throw new BadRequestError(`Member ${member.name} is under penalty until ${member.penaltyEndDate.toISOString().split('T')[0]}`);
    }

    const book = await Book.findById(bookId);
    if (!book) throw new NotFoundError('Book not found');
    if (book.stock <= 0) throw new BadRequestError('Book is currently unavailable');

    if (member.borrowedBooks.length >= 2) throw new BadRequestError('Member has already borrowed 2 books');

    const alreadyBorrowed = member.borrowedBooks.some(borrowedBook => borrowedBook.book._id.equals(bookId));
    if (alreadyBorrowed) throw new BadRequestError('Member already borrowed this book');

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format tanggal
    member.borrowedBooks.push({
        book: book._id,
        borrowDate: formattedDate
    });
    book.stock -= 1;

    await member.save();
    await book.save();

    return member;
};


const returnBook = async (memberId, bookId, returnDate = new Date()) => {
    const member = await Member.findById(memberId).populate('borrowedBooks.book').select('-__v');
    if (!member) throw new NotFoundError('Member not found');

    // Cek apakah penalti sudah berakhir
    if (member.penalty && member.penaltyEndDate && new Date() > member.penaltyEndDate) {
        member.penalty = false;
        member.penaltyEndDate = null;
    }

    const book = await Book.findById(bookId);
    if (!book) throw new NotFoundError('Book not found');

    const borrowedBookIndex = member.borrowedBooks.findIndex(b => b.book._id.equals(bookId));
    if (borrowedBookIndex === -1) throw new BadRequestError('Book not borrowed by this member');

    const borrowedDate = new Date(member.borrowedBooks[borrowedBookIndex].borrowDate);
    // console.log("Borrowed Date:", borrowedDate.toISOString().split('T')[0]);

    const daysBorrowed = Math.floor((returnDate - borrowedDate) / (1000 * 60 * 60 * 24));
    // console.log("Return Date:", returnDate.toISOString().split('T')[0]);
    // console.log("Days Borrowed:", daysBorrowed);

    const returnedBook = {
        code: book.code,
        title: book.title
    };

    // Hapus buku dari borrowedBooks
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
        returnedBook 
    };
};


const getMembers = async () => {
    const members = await Member.find().populate({
        path: 'borrowedBooks.book',
        select: 'title author -_id'
    }).select('-__v');
    if (!members || members.length === 0) throw new NotFoundError('No members found');

    return members;
};

module.exports = {
    borrowBook,
    returnBook,
    getMembers,
};
