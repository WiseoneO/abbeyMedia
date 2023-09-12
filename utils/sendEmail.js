const nodemailer = require('nodemailer');
const config = require('../config/default');

const sendEmail = async options =>{
    transporter = nodemailer.createTransport({
        host: config.emailHost,
        port: config.emailPort,
        auth: {
          user: config.mailuserid,
          pass: config.mailPassword
        }
    });

    const message = {
        from : `${config.mailName} <${config.mailFrom}>`,
        to : options.email,
        subject : options.subject,
        text : options.message
    }
    await transporter.sendMail(message)

}

module.exports = sendEmail;