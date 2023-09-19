let express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./src/middlewares/errors');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

// Setup security headers
app.use(helmet());

// Prevent parameter pollution
app.use(hpp());

// sanitize data
app.use(mongoSanitize());

// prevent xss attacks
app.use(xssClean())

// Setup cors - Accessible by other domains
app.use(cors());

// Setup body parser
app.use(express.json());

// Setup cookie parser
app.use(cookieParser());

//handling all uncaught errors
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTIONS! 🔥 Shutting down...");
    console.log(`${err.name} : ${err.message}`);
    process.exit(1);
  });
// firing the routes
app.use(require('./src/routes/index'));

// middleware to handle global errors
app.use(globalErrorHandler);

module.exports = app;



