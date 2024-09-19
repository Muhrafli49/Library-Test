class ResponseError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = ResponseError;
