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
		  
				var mailConnection = application.config.mailConnection;				
				var mailOptions = {
					from: 'SEMED Guarapari/ES',
					to: result[0].email,
					subject: 'Recuperação de senha - Processo Seletivo Simplificado',
					html: '<html> <head> <style> p, h2, h3 {font-family: Arial, Helvetica, sans-serif;}</style>	</head> <body> <h2>PREFEITURA MUNICIPAL DE GUARAPARI</h2> <h3>SECRETARIA MUNICIPAL DE EDUCAÇÃO</h3>	<h3>Processo Seletivo Simplificado - Edital nº 008/2018</h3> <br/> <p>Olá, '+result[0].nome+'! </p> <p>A senha cadastrada para o CPF '+result[0].cpf+' é:</p> <p><b>'+result[0].senha+'</b></p> <br/><p style="font-size:12px;">Este é um e-mail automático, não é necessário respondê-lo.</p> <br/> <p>Atenciosamente,</p> <p>Comissão Organizadora do Processo Seletivo</p>' 
				};

				mailConnection.sendMail(mailOptions, function(error, info){
					if (error) {
						erros = [{location: 'body', param: 'cpf', msg: 'Email não enviado!', value: dadosForm.cpf}];;
					} else {
						erros = [{location: 'body', param: 'cpf', msg: 'Recuperação de senha enviada para o e-mail cadastrado "'+result[0].email+'"' , value: dadosForm.cpf}];
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
			
			var dateFormat = require('dateformat');
			ProsesimModel.getCandidato(dadosForm.cpf, function(error, result){
				result[0].nascimento = dateFormat(result[0].nascimento, "dd/mm/yyyy");
				res.render("candidatos/candidato", {candidato : result});
				console.log(result);
			});		
		});
	};
};