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
      sendErrorProd(err, res);
    }
  };