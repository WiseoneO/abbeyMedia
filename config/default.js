require('dotenv').config();

const config = {
    port: process.env.PORT || 6000,
    node_env: process.env.NODE_ENV,
    db_local_uri: process.env.DB_LOCAL_URI,
    db_uri : process.env.DB_URI,
    jwt_secret : process.env.JWT_SECRET,
    cookie_expires_time: process.env.COOKIE_EXPIRES_TIME,
    jwt_expires_in : process.env.JWT_EXPIRES_IN,
    geocoder_provider: process.env.GEOCODER_PROVIDER,
    mapquest_consumer_key: process.env.MAPQUEST_CONSUMER_KEY,
    userSecret : process.env.USER_JWT_SECRET_KEY,
    userEmailSecret : process.env.USER_EMAIL_VERIFICATION_SECRET,

     // email
    emailHost : process.env.MAIL_TRAP_HOST,
    emailPort : process.env.MAIL_TRAP_PORT,
    mailuserid : process.env.MAIL_TRAP_USER,
    mailPassword : process.env.MAIL_TRAP_PASSWORD,
    mailFrom: process.env.SMTP_FROM_EMAIL,
    mailName: process.env.SMTP_FROM_NAME,

    //  File Upload
    max_file_size: process.env.MAX_FILE_SIZE,
    upload_path: process.env.UPLOAD_PATH

}

module.exports = config;