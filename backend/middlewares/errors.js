const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack
    })
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err }

    error.message = err.message;

    // Wrong Mongoose Object ID Error // NOT WORK
    if (err.name === 'CastError') {
      /* // ghi đè giá trị của biến error và không còn liên quan đến biến err gốc nữa. 
      const message = `Resource not found. Invalid: ${err.path}`
      error = new ErrorHandler(message, 400) */
      err.message = `Resource not found. Invalid: ${err.path}`;
      err.statusCode = 400;
    }

    // Handling Mongoose Validation Error
    if (err.name === 'ValidationError') {

      /* // ghi đè giá trị của biến error và không còn liên quan đến biến err gốc nữa. 
      const message = Object.values(err.errors).map(value => value.message);
      error = new ErrorHandler(message, 400) */
      const message = Object.values(err.errors).map(value => value.message);
      err.message = message;
      err.statusCode = 400;
    }

    // Handling Mongoose duplicate key errors
    if (err.code === 11000) {
      /* const message = `Duplicate ${Object.keys(err.keyValue)} entered`
      error = new ErrorHandler(message, 400) */
      message = `Duplicate ${Object.keys(err.keyValue)} entered`
      err.message = message;
      err.statusCode = 400;
    }

    // Handling wrong JWT error
    if (err.name === 'JsonWebTokenError') {
      const message = 'JSON Web Token is invalid. Try Again!!!';
      err.message = message;
      err.statusCode = 400;
    }

    // Handling expired JWT error
    if (err.name === 'TokenExpiredError') {
      const message = 'JSON Web Token is expired. Try Again!!!';
      err.message = message;
      err.statusCode = 400;
    }  

    res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error'
      // error: err.stack
    })
  }

}