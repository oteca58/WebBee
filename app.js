const path = require("path");
const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");
const beehiveRouter = require("./routes/beehiveRouter");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 1) MIDDLEWARES

//if environment is development morgan used
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//error handling middleware
app.use(globalErrorHandler);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);

  next();
});

//3) routes
app.use("/", viewRouter);
app.use("/", beehiveRouter);
app.use("/api/v1/users", userRouter);

//implements errors
app.all("*", (req, res, next) => {
  //old procedure
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.code = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//error handling middleware
app.use(globalErrorHandler);

module.exports = app;
