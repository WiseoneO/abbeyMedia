const app = require('../app');
const PORT = process.env.PORT;
const database = require("./database");

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