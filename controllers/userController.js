const userModel = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

// Get current user profile
exports.getUserProfile = catchAsyncErrors(async(req, res,next)=>{
    const user = await userModel.findById(req.user.id).populate([
        {path: "followers", select:["username"]},
        {path: "following", select:["username"]}
    ])

    res.status(200).json({
        success: true,
        data: user
    });
});

// update current user password =>/api/v1/user/password/update
exports.updatePassword = catchAsyncErrors(async(req, res, next)=>{
    const user = await userModel.findById(req.user.id).select('+password');

    // check previous user password
    const isMatched = await user.comparePassword(req.body.currentPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 204, res);
});

// Update current user data => /api/v1/profile/update
exports.updateUser = catchAsyncErrors(async(req, res, next)=>{
    const newUserData = {
        name: req.body.username,
        email: req.body.email,
    }

    const user = await userModel.findByIdAndUpdate(req.user.id, newUserData,{
        new: true

    });

    res.status(204).json({
        success: true,
        data:user
    });
});

// following an existing user => /api/v1/user/:slug/follow
exports.userFollow = catchAsyncErrors(async(req, res, next)=>{
    const currentUser = await userModel.findById(req.user.id);

    // 1) search for a user with the username
    const userToFollow = await userModel.findOne(
        {
            slug: req.params.slug, 
            isDeleted:false
        });
    const targetId = userToFollow._id

        // 2) check if user exists
    if(!userToFollow){
        return next(new ErrorHandler('User not found', 404));
    };

    // 3) Check if the current user is already a follower of the targeted user
    if(userToFollow.followers.includes(currentUser._id)){
        return next(new ErrorHandler('you already follow this user'));
    }

    // 4) update the current user following array 
    await userModel.findByIdAndUpdate({_id:req.user.id}, {$push:{following: userToFollow._id}}, {new: true});

    // 5) update the targeted user follower array
    await userModel.findByIdAndUpdate({_id:targetId}, {$push:{followers: req.user._id}}, {new: true});
    res.status(204).json({
        success: true,
    });

    
});
// unfollow an existing user => /api/v1/user/:slug/unfollow
exports.userUnfollow = catchAsyncErrors(async(req, res, next)=>{
    const currentUser = await userModel.findById(req.user._id);

    // 1)Search for the user to unfollow
    const targetedUser = await userModel.findOne({slug:req.params.slug});
        currentId = currentUser._id.toString();
        targetId = targetedUser._id.toString();

    // 2) if user does not exist
    if(!targetedUser){
        return next(new ErrorHandler('user not found',404));
    }

    //  3) Check if current users follows the targeted user
    if(!targetedUser.followers.includes(currentUser._id.toString())){
        return next(new ErrorHandler(`You dont't follow this user`,404));
    }

    // 3) Remove current user from the targeted follower array
    await userModel.updateOne({_id: targetId}, {$pull:{followers:currentId}});

    // 4) remove current user from the current using following
    await userModel.updateOne({_id: currentId}, {$pull:{following:targetId}});

    res.status(204).json({
        success: true,
    })



    

    
});

// Delete current user Temporarily =>/api/v1/user/restore/:slug (admin only)
exports.restoreProfile = catchAsyncErrors(async(req,res, next)=>{

    // Reset isDeleted boolean value to false
    const restoreusers = await userModel.updateMany(
        {_id:{$in: req.body.ids}},
        {isDeleted: false}
        );

    if(restoreusers){
        return res.status(204).json({
            success: true,
            message: 'Your account has been restored'
        });
    }
    
});
exports.deleteProfile = catchAsyncErrors(async(req,res, next)=>{

    await userModel.findByIdAndUpdate( {_id:req.user.id},{isDeleted: true},{new: true});

    res.cookie('token', 'none',{
        expires: new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success: true,
        message: 'Your account has been deleted'
    });
});