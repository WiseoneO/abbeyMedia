const config = require('../config/default');
const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;

    if(config.node_env === 'development'){
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Production Mode Error Handler
    if(config.node_env === 'production'){
        let error = {...err};

        error.message = err.message;

        // Wrong mongoose object ID error
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 404);
        }
        
        // Handling mongoose Validation Error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value =>value.message);
            error = new ErrorHandler(message, 400);

        }

        // Handle mongoose duplicate key error
        if(err.code === 11000){
            const message =  `Duplicate ${Object.keys(err.keyValue)} entered.`;
            error = new ErrorHandler(message, 400);
        }


        // Handlig wrong jwt token error
        if(err.name === 'JsonWebTokenError'){
            message = 'JSON Web token is invalid. Try again';
            error = new ErrorHandler(message, 500)
        };

        // Handling Expired JWT token error
        if(err.name === 'TokenExpiredError'){
            message = 'JSON Web token is expired. Try Again!';
            error = new ErrorHandler(message, 500)
        }
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Serval Error'
        });
    }

}