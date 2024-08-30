const nodemailer = require('nodemailer')

const env = process.env;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: env.MAIL,
        pass: env.MAIL_SECRET
    }
});

module.exports = transport