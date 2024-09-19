const { StatusCodes } = require('http-status-codes');
const { borrowBook, returnBook, getMembers } = require('../../services/members');


const handleBorrowBook = async (req, res, next) => {
    try {
        const { memberId, bookId } = req.body;
        const result = await borrowBook(memberId, bookId);
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Buku berhasil dipinjam',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const handleReturnBook = async (req, res, next) => {
    try {
        const { memberId, bookId } = req.body;
        const result = await returnBook(memberId, bookId);
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Buku berhasil dikembalikan',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const handleGetMembers = async (req, res, next) => {
    try {
        const result = await getMembers();
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Berhasil mendapatkan daftar anggota',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    handleBorrowBook,
    handleReturnBook,
    handleGetMembers,
};
