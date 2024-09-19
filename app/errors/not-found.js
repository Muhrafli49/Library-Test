const { StatusCodes } = require('http-status-codes');
const ResponseError = require ('./response-error');

class NotFound extends ResponseError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFound;