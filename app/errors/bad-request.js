const { StatusCodes } = require('http-status-codes');

const ResponseError = require('./response-error');

class BadRequest extends ResponseError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequest;