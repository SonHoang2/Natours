import config from '../config/config.js';
import AppError from '../utils/AppError.js';

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value} Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    console.log(errors);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = err => new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, res) => {
    console.log(err);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

const errorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (config.env === 'development') {
        sendErrorDev(err, res);
    } else if (config.env === 'production') {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;
        error.errmsg = err.errmsg;
        
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};

export default errorController;