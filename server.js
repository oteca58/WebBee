const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config/config.env" });

//handling of synchronous errors
process.on('uncaugthExeption', err=>{
  console.log(err.name, err.message)
  console.log('UNCAUGTH EXEPTION!  Shutting down...')
  process.exit(1);
});

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
  
  const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
//server connection error handling
process.on('unhandledRejection', err=>{
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION!  Shutting down...')
  server.close(()=>{  //with the close it ends all pending promises
    process.exit(1);
  });

});
