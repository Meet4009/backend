const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error";


    // wrong MongoDB Id Error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // MongoDB duplicate Key Error
    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} already registered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong JWT Error
    if (err.name === "JsonWebtokenError") {
        const message = `Json Web Token is invalid, try again `;
        err = new ErrorHandler(message, 400);
    }
    
    // JWT EXPIRE Error
    if (err.name === "TokenExpiredError"){
        const message = `Json Web Token is invalid, try again `;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};