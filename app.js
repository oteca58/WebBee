const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError")
const globalErrorHandler = require ("./controllers/errorController")

// We are going to use this route to get a single beehive
// /api/v1/beekeepers/beekeeper-1/beehives/beehive-1

const userRouter = require("./routes/userRouter");
const beehiveRouter = require("./routes/beehiveRouter");

const app = express();

// 1) MIDDLEWARES

//if environment is development morgan used
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//error handling middleware 
app.use(globalErrorHandler);

app.use(express.json());
app.use(express.static(`${__dirname}/public)`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);

  next();
});

// 2) ROUTES

app.use("/api/v1/users", userRouter);
app.use("/api/v1/users/beehives", beehiveRouter);

//implements errors
app.all("*", (req, res, next) => {
  //old procedure
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.code = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
})

//error handling middleware 
app.use(globalErrorHandler);

module.exports = app;
