const config = require('../config/default');


// create and send token and save cookie
const sendToken = (user, statusCode, res)=>{
    // create jwt token
    const token =  user.getJwtToken();


    // options for cookie
    const options = {
        expires : new Date(Date.now() + 5* 24*60*60*1000),
        httpOnly: true
    };

    // Setting the secure cookie to true in production environment
    if(config.node_env === 'production'){
        options.secure = true;
    }
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
} 

module.exports = sendToken;