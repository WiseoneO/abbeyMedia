let express = require("express");
const app = express();
const config = require('./config/default');
const cookieParser = require('cookie-parser');
const connectDatabase = require('./config/database');
const erroMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler');

// Importing routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

// Handling uncaught exceptions
process.on('uncaughtException',err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down due to uncaught exception`);
    process.exit(1);
});

// connecting to database
connectDatabase();

// Setup body parser
app.use(express.json());

// Setup cookie parser
    app.use(cookieParser());

// firing the routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

// Handled unhandled routes
app.all('*', (req, res, next)=>{
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

// middleware to handle errors
app.use(erroMiddleware);

const server = app.listen(config.port, ()=>{
    console.log(`Server started on port ${config.port} in ${config.node_env} mode`)
});

// Handling unhandled Promise Rejection
process.on('unhandledRejection', err =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    });
});

