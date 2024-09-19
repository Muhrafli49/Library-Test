const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    
    // console.error(err);

    res.status(statusCode).json({
        code: statusCode,
        message: message,
    });
};

module.exports = errorHandler;
