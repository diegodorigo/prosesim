var nodemailer = require('nodemailer');

var connMail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secureConnection: true,
    port: 587,
    tls:{rejectUnauthorized: false},
    auth: {
        user: 'processoseletivo.guarapari@gmail.com',
        pass: '35421429'
    }
});	

module.exports = function (){
	return connMail;
}