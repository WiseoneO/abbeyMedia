let express = require("express");
const app = express();
const config = require('./config/default');
const cookieParser = require('cookie-parser');
const connectDatabase = require('./config/database');
const erroMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler');
const cors = require('cors');
const helment = require('helment');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');


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

// Setup security headers
app.use(helment());

// Setup cors - Accessible by other domains
app.use(cors());

// Prevent parameter pollution
app.use(hpp());

// sanitize data
app.use(mongoSanitize());

// prevent xss attacks
app.use(xssClean())

// Setup body parser
app.use(express.json());

// Setup cookie parser
app.use(cookieParser());

// Base route
app.get('/', (req, res)=>{
    res.status(200).json({
        success: true,
        env: config.node_env,
        Project_Name: `Abbey Media`
    })
})

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

