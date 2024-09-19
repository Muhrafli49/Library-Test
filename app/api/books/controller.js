const { StatusCodes } = require('http-status-codes');
const { getAvailableBooks } = require('../../services/books');

const index = async (req, res, next) => {
    try {
        const result = await getAvailableBooks(req);
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Data buku berhasil didapatkan',
            data: result
        });

    } catch (err) {
        next(err)
    }
};


module.exports = { 
    index
}