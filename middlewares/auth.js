const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const config = require('../config/default');

// Check if User is authenticated!
exports.isAuthenticated = catchAsyncErrors(async(req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new ErrorHandler('Login  to access this resource.',401));
    }

    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = await userModel.findById(decoded.id);

    next();
})


// Handling users roles
exports.authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,401));
        }
        next();

    }
}