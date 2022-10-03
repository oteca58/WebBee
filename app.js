const express = require("express");
const morgan = require("morgan");

const AppError = require('./app.utils/app.Error')


// We are going to use this route to get a single beehive
// /api/v1/beekeepers/beekeeper-1/beehives/beehive-1
const globalErrorHandler = require('./controllers/errorController')
const beekeeperRouter = require("./routes/beekeeperRouter");
const beehiveRouter = require("./routes/beehiveRouter");

const app = express();

// 1) MIDDLEWARES

//if environment is development morgan is used
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//Error handling
app.use(globalErrorHandler);
// app.use(((err, req, res, next)=>{
  // err.statusCode = err.statusCode || 500;
  // err.status = err.status || 'error';

  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: error.message
//   })
// }))
app.use(express.json());
app.use(express.static(`${__dirname}/public)`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES

app.use("/api/v1/beekeepers", beekeeperRouter);
app.use("/api/v1/beehives", beehiveRouter);

//It handles all that which is not defined
app.all("*",(req, res, next)=>{
  next(new AppError(`Cant'find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
