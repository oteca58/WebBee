const express = require("express");
const morgan = require("morgan");

// We are going to use this route to get a single beehive
// /api/v1/beekeepers/beekeeper-1/beehives/beehive-1

const beekeeperRouter = require("./routes/beekeeperRouter");
const beehiveRouter = require("./routes/beehiveRouter");

const app = express();

// 1) MIDDLEWARES

//if environment is development morgan is used
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public)`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES

app.use("/api/v1/beekeepers", beekeeperRouter);
app.use("/api/v1/beehives", beehiveRouter);

module.exports = app;
