const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = require("./app");
const http = require("http");

const { MongoMemoryServer } = require("mongodb-memory-server");
let mongod = null;

dotenv.config({ path: "./config/config.env" });

const connectDB = async () => {
  try {
    //replace password with
    let DB = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    );
    if (process.env.NODE_ENV === "test") {
      mongod = await MongoMemoryServer.create();
      DB = mongod.getUri();
    }

    await mongoose
      .connect(DB, {
        useNewUrlParser: true,
      })
      .then(() => {
        console.log("DB connection successful!");
      });
  } catch {
    (err) => console.log("ERROR"); //if password is wrong print error
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  function server() {
    const server = (http.server = app.listen(port, () => {
      console.log(`App running on port ${port}`);
    }));
    return server;
  }
  server();
  //manage other errors DA RIMETTERE
  process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection. Shutting down...");
    console.log(err.name, err.message);
    //before closing server and after the app
    server.close(() => {
      process.exit(1); //0 is for success and 1 is for errors
    });
  });
}

module.exports = { connectDB, disconnectDB };
