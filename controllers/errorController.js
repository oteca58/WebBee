const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  //regex to find the duplicate field.
  const value = err.message.match(/[^{\}]+(?=})/g);
  const message = `Error: Duplicate field value: '${value}'. Use another one`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const message = `${err.message}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid token, log in again!", 401);

const handleTokenExpiredError = () => new AppError("Expired token, log in again!", 401);


const sendErrorDev = (err, res) => {
  console.log("errorDev1");
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  console.log("errorProd");
  //operational error came from appError.js -- send message to the client
  if (err.isOperational) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
//unknown error: don't leak error details to the client
} else {
  //1) log error
  console.error("Error", err);


  //2) send generic message
  res.status(500).json({
    status: "error",
    message: "something is wrong",
  })
}
};

//error handling middleware 
module.exports = (err, req, res, next) => {
    //console.log(err.stack) for find all routes errors;
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
      sendErrorDev(err, res);
      } else if ((process.env.NODE_ENV === "production")) {
        
        let error = err;
        //name error in postman if the Id isn't correct, pass a function to manage this error
        if (error.name === "CastError") error = handleCastErrorDB(error);
        //error for duplicate name with POST method, 11000 is code for duplication
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        //error for wrong name in PATCH method
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

        sendErrorProd(error, res);
    }
};