const app = require('../app');
const PORT = process.env.PORT;
const database = require("./database");

//handling all uncaught errors
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTIONS! 🔥 Shutting down...");
  console.log(`${err.name} : ${err.message}`);
  process.exit(1);
});

//start the server
const server = app.listen(PORT, () => {
  console.log(`app is running at PORT ${PORT}`);
});


//connect database
database.connect().then((con) => {
  console.log(`Database is connected`);
});

//handling unhandledRejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});