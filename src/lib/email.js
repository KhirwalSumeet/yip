const nodemailer = require('nodemailer');
const config     = require(__dirname + '/../../config/index.js');

var email = {};

var Transporter = nodemailer.createTransport(config.email);
var Mails = {
    verification: {
        from: '"Branding and Relations Cell, IIT Kharagpur" <barc@iitkgp.ac.in>',
        to: '',
        subject: 'Young Innovator\'s Program Account Verification ✔',
        text: 'To validate your account please visit the following link LINKREPLACE', 
        html: '<p>To validate your account please visit the following link <a href="LINKREPLACE">LINKREPLACE</a></p>'
    }
};

email.sendVerification = function(receiver, url, cb) {
    var mail = {
        from    : Mails.verification.from,
        subject : Mails.verification.subject,
        text    : Mails.verification.text.replace(/LINKREPLACE/g, url),
        html    : Mails.verification.html.replace(/LINKREPLACE/g, url),
        to      : receiver
    };

    Transporter.sendMail(mail, function(err, info) {
        if(err) {
            config.logger.log(err);
            cb(err);
            return;
        }
        config.logger.log('Message %s sent: %s', info.messageId, info.response);
        cb(); 
    })
}

module.exports = email;