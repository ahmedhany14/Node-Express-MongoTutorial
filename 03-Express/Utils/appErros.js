class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode % 100 === 4 ? 'failed' : 'error';
        this.operationalErorr = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;