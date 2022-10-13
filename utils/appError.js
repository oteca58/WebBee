class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode
        //the "?" is a Conditional (ternary) operator
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;