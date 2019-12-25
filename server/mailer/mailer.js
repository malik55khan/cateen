var nodemailer = require('nodemailer');
var CONFIG = require('../config/index');

console.log(CONFIG);


module.exports.sendMail = function (fromEmail='',to, subject,message,filename='') {
    
        fromEmail = fromEmail=="" ? CONFIG.SMTP.SUPPORT_EMAIL : fromEmail;
        var toEmail = to;
        var transporter = nodemailer.createTransport({            
            service: CONFIG.SMTP.SERVICE,           
            auth: {
                user: CONFIG.SMTP.USER,
                pass: CONFIG.SMTP.PASS
            }
        });
        transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: subject,
            // text: url,
            html: message,
            attachments: filename
        }, function (error, response) {
            if (error) {
                console.log('err',error);
            } else {
                console.log('Success',response);
            }
        });

    
};
