//error handling middleware 
module.exports = (err, req, res, next) => {
    //console.log(err.stack) for find all routes errors;
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status;
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }