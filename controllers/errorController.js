const AppError = require('../utils/appError')

// handleCastelErrorDb, handleDuplicateFieldsrDb, ValidationError
// to give more sympathetics errors to Mongoose errors
const handleCastelErrorDb = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400);
};
const handleDuplicateFieldsrDb = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/[0]); //errmsg is MongoDBerror'key  
  const message = `Duplicate  fiel value : ${value} Please use another value!`
  return new AppError(message, 400);
}

const handleValidationErrorDb = err => {
  const errors = Object.values(err.errors).map(el=>el.message);

  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);

}
const sendErrorDev = (err, res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    message: error.message,
    error: err,
    stack: error.stack
  });
};

const sendErrorProd = (err, res)=>{
  //Operational, trasted error: send message to client
 if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: error.message,
    });
    //programming or other unknow error:don't leak to detail
  }else{
    //1) Log error
    console.error('ERROR',err)
    //2)Send generic message 
    res.status(500).json({
      status: 'error',
      message: 'Someting went wrong!'
    })
  }
};


module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(processenv.NODE_ENV === 'develpment'){
      sendErrorDev = (err, res);
    }
    else if(processenv.NODE_ENV === 'production'){
      let error = {...err}
      //if our error is CastError:
      if(error.name ==='CastError') error = handleCastelErrorDb(error);
      //if our error is becouse duplicate value-when the value must be unique-:
      if(error.code === 11000) handleDuplicateFieldsrDb(error);
      if(error.name ==='ValidationError') 
      error = handleValidationErrorDb(error);
error = 
      sendErrorProd(error, res);
    }
  };