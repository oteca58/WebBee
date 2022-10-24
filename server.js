const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = require("./app");

//manage uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception. Shutting down...");
  console.log(err.name, err.message);
  process.exit(1); //0 is for success and 1 is for errors
});

dotenv.config({ path: "./config/config.env" });

//replace password with
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });
//.catch(err => console.log("ERROR")); if password is wrong print error

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//manage other errors
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection. Shutting down...");
  console.log(err.name, err.message);
  //before closing server and after the app
  server.close(() => {
    process.exit(1); //0 is for success and 1 is for errors
  });
});
