const nodemailer = require('nodemailer');

exports.postEmail = function(req, res) {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'testnodemailer123456@gmail.com',
        pass: 'TestNodemailer123'
        }
    });
    
    const email = JSON.parse(req.body.Email);

    var mailOptions = {
        from: 'testnodemailer123456@gmail.com',
        to: email.interchangeAddress + "," + email.trainerAddress,
        subject: email.subject,
        text: email.body       
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
};