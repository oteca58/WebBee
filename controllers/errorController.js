const sendErrorDev = (err, res) => {
  console.log("errorDev1", err.status)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

const sendErrorProd = (err, res) => {
  console.log("errorProd", err.status)
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
}

//error handling middleware 
module.exports = (err, req, res, next) => {
    //console.log(err.stack) for find all routes errors;
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
      sendErrorDev(err, res);
      } else if ((process.env.NODE_ENV === "production")) {
      sendErrorProd(err, res);
    }
  }