module.exports.index = function(application, req, res){
	res.render("home/index", {validacao:{}, dadosForm: {}});
};

module.exports.acessaCandidato = function(application, req, res) {

	var connection = application.config.dbConnection();
	var ProsesimModel = new application.app.models.ProsesimDAO(connection);
	var dadosForm = req.body;
	var erros = [];	
	
	if (dadosForm.remember){
		ProsesimModel.checkUser(dadosForm.cpf, function(error, result){
			if (result == ''){
				erros = [{location: 'body', param: 'cpf', msg: 'CPF não cadastrado!', value: dadosForm.cpf}];
			};	
	
			if (erros.length > 0){				
				res.render("home/index", {validacao : erros, dadosForm: dadosForm});
				return;
			};
			
			ProsesimModel.getCandidato(dadosForm.cpf, function(error, result){
				var nodemailer = require('nodemailer');
				var transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					secureConnection: true,
					port: 587,
					tls:{rejectUnauthorized: false},
					auth: {
					  user: 'diego@tecsystem.info',
					  pass: 'DdNbAsS@12'
					}
				});				  
				var mailOptions = {
					from: 'diego@tecsystem.com.br',
					to: result[0].email,
					subject: 'Recuperação de senha com nodemailer',
					text: 'Sua senha é "'+result[0].senha+'"'
				};				  
				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						erros = [{location: 'body', param: 'cpf', msg: 'Email não enviado!', value: dadosForm.cpf}];;
					} else {
						erros = [{location: 'body', param: 'cpf', msg: 'Recuperação de senha enviada para o e-mail "'+result[0].email+'"' , value: dadosForm.cpf}];
					}
					res.render("home/index", {validacao : erros, dadosForm: dadosForm});
					return;
				});
			});		
		});

		return;
	
	} else {
		ProsesimModel.checkUser(dadosForm.cpf, function(error, result){
			if (result == ''){
				erros = [{location: 'body', param: 'cpf', msg: 'CPF não cadastrado!', value: dadosForm.cpf}];
			} else{
				if (dadosForm.senha != result[0].senha){
					erros = [{location: 'body', param: 'senha', msg: 'Senha inválida!', value: dadosForm.senha}];
				};
			};	
	
			if (erros.length > 0){
				res.render("home/index", {validacao : erros, dadosForm: dadosForm});
				return;
			};
			
			ProsesimModel.getCandidato(dadosForm.cpf, function(error, result){
				res.render("candidatos/candidato", {candidato : result});
			});		
		});
	};
};