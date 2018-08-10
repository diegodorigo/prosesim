var nodemailer = require('nodemailer');

var connMail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 587,
    tls:{rejectUnauthorized: false},
    auth: {
        user: 'diego@tecsystem.info',
        pass: 'DdNbAsS@12'
    }
});	

module.exports = function (){
	return connMail;
}