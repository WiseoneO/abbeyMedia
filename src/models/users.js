const mongoose = require('mongoose');
// const {Schema} = require(mongoose.Schema)
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default');
const crypto = require('crypto');
const slugify = require('slugify');

const userSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required:[true, 'Please enter your name.'],
        unique: true
    },
    slug: String,
    email:{
        type: String,
        required: [true, 'Please enter your email address.'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address.']

    },
    role:{
        type: String,
        enum: {
            values:['user','admin'],
            message: 'Please select a correct role'
        },
        default: 'user'
    },
    
    password: {
        type: String,
        required:[true,'Please enter password for your account'],
        minlength: [8, 'Your password must be at least 8 character long'],
        selcet: false
    },

    followers: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
      },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Creating job slug befor saving
userSchema.pre('save', function(next){
    // creating slug before saving to DB
    this.slug = slugify(this.username, {lower:true});
    next();
})

// Encrypting password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Return json web token
userSchema.methods.getJwtToken =  function(){

    return jwt.sign({id: this._id}, config.jwt_secret,{
        expiresIn: config.jwt_expires_in,
    });

}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function(){
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to reset password token
    this.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
    
    // Set token expiry time
    this.resetPasswordExpire = Date.now() + 30*60*1000;

    return resetToken;

}



module.exports = mongoose.model('User', userSchema);