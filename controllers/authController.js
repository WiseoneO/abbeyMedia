const userModel = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register a new user =>/api/v1/user/register
exports.registerUser = catchAsyncErrors(async(req, res, next)=>{
    const {username,email,password,role} = req.body;

    const user = await userModel.create({
        username,
        email,
        password,
        role
    });

    sendToken(user, 201, res);
});

// Login in user  =>/api/v1/auth/login
exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
    const {email, password} = req.body;

    // check if email or password is entered by users
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    // check if email exist
    const user = await userModel.findOne({email: email}).select('+password');

    if(!user){
        return next(new ErrorHandler(`No user with ${email} found.`, 401))
    }

    // check if password is correct
    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 200, res);

});

// forgot password =>/api/v1/auth/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
    const user = await userModel.findOne({email: req.body.email});

    // Check if email do not exist
    if(!user){
        return next(new ErrorHandler('No user found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/password/reset/${resetToken}`;
    const message = `Your password reset link is as follows:\n${resetUrl}
    \n\n If you have not requested this please ignore this.`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Abbey Media password Recovery',
            message
    
        });
    
        res.status(200).json({
            success: true,
            message: `Email sent successfull to: ${user.email}`
        });
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler('Email not sent', 500))
    }


    
});

// Reset password =>/api/v1/auth/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{
    // Hash url token 
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await userModel.findOne({
        resetPasswordToken, 
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});

// Logout user =>/api/v1/auth/logout
exports.logout = catchAsyncErrors(async(req, res, next)=>{
    res.cookie('token', 'none',{
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
    })

})