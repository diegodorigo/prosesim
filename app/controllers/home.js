module.exports.index = function(application, req, res){
	//Valida navegador
	const browser = require('browser-detect');
	const navegador = browser(req.headers['user-agent']);
	if (navegador.name == 'ie') {
		res.render("home/navegador");
		return;
	};
	
	var DataAtual = new Date();
	DataAtual.setMinutes(DataAtual.getMinutes()-180);
	
	var DataEncerramento = new Date("2018-12-15T22:00:00");
	DataEncerramento.setMinutes(DataEncerramento.getMinutes()-180);

	if (DataAtual.valueOf() > DataEncerramento.valueOf()){
		res.render("home/encerrado");
	} else {
		res.render("home/index", {validacao:{}, informacao : {}, dadosForm: {}});
	};	
};

module.exports.recuperaSenha = function(application, req, res) {
	var dadosForm = req.body;
	var connection      = application.config.dbConnection();
	var CandidatosModel = new application.app.models.CandidatosDAO(connection);
	
	var erros = [];
	CandidatosModel.checkUser(dadosForm.cpf, function(error, result){		
		if (dadosForm.cpf == ''){
			erros = [{location: 'body', param: 'cpf', msg: 'Informe o CPF para recuperar a senha.', value: dadosForm.cpf}];
		} else {
			if (result == ''){			
				erros = [{location: 'body', param: 'cpf', msg: 'CPF não cadastrado!', value: dadosForm.cpf}];
			};				
		};
		if (erros.length > 0){				
			res.render("home/index", {validacao : erros, informacao : {}, dadosForm: dadosForm});
			return;
		};
		
		CandidatosModel.getCandidato(dadosForm.cpf, 0, function(error, result){
	  
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
					info = [{location: 'body', param: 'cpf', msg: 'Recuperação de senha enviada para o e-mail cadastrado "'+result[0].email+'"' , value: dadosForm.cpf}];
				}
				res.render("home/index", {validacao : erros, informacao : info, dadosForm: dadosForm});
				return;
			});
		});		
	});
};

module.exports.acessaCandidato = function(application, req, res) {
	var connection      = application.config.dbConnection();
	var CandidatosModel = new application.app.models.CandidatosDAO(connection);
	var CursosModel     = new application.app.models.CursosDAO(connection);
	var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
	var dadosForm       = req.body;
	var erros           = [];
	var dateFormat = require('dateformat');	

	CandidatosModel.checkUser(dadosForm.cpf, function(error, result){
		if (dadosForm.cpf == ''){
			erros = [{location: 'body', param: 'cpf', msg: 'Informe o CPF e senha para acessar!', value: dadosForm.cpf}];
		} else {
			if (result == ''){
				erros = [{location: 'body', param: 'cpf', msg: 'CPF não cadastrado!', value: dadosForm.cpf}];
			} else{
				if (dadosForm.senha != result[0].senha){
					erros = [{location: 'body', param: 'senha', msg: 'Senha inválida!', value: dadosForm.senha}];
				};
			};	
		};		

		if (erros.length > 0){
			res.render("home/index", {validacao : erros, informacao : {}, dadosForm: dadosForm});
			return;
		};
		
		//RECUPERA O CANDIDATO
		CandidatosModel.getCandidato(dadosForm.cpf, result[0].codigocandidato, function(error, resultcandidato){
			resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");	
			//RECUPERA AS INSCRIÇÕES DO CANDIDATO
			CandidatosModel.getInscricoesCandidato(resultcandidato[0].codigocandidato, function(error, resultinscricoes){
				//INSCRIÇÃO 1
				if (resultinscricoes[0] != null) {
					resultinscricoes[0].datainscricao = dateFormat(resultinscricoes[0].datainscricao, "dd/mm/yyyy - HH:MM");		
					//RECUPERA CURSOS DA INSCRIÇÃO 1
					CursosModel.getCursosInscricao(resultinscricoes[0].codigoinscricao, function(error, resultcursos1){	
						//RECUPERA FUNÇÕES DA INSCRIÇÃO 1
						FuncoesModel.getFuncoesInscricao(resultinscricoes[0].codigoinscricao, function(error, resultfuncoes1){
							for(var i = 0; i < resultfuncoes1.length; i++){
								resultfuncoes1[i].datainicial = dateFormat(resultfuncoes1[i].datainicial, "dd/mm/yyyy");
								resultfuncoes1[i].datafinal = dateFormat(resultfuncoes1[i].datafinal, "dd/mm/yyyy");
							};								
							//INSCRIÇÃO 2
							if (resultinscricoes[1] != null) {
								resultinscricoes[1].datainscricao = dateFormat(resultinscricoes[1].datainscricao, "dd/mm/yyyy - HH:MM");
								//RECUPERA CURSOS DA INSCRIÇÃO 2
								CursosModel.getCursosInscricao(resultinscricoes[1].codigoinscricao, function(error, resultcursos2){
									//RECUPERA FUNÇÕES DA INSCRIÇÃO 2
									FuncoesModel.getFuncoesInscricao(resultinscricoes[1].codigoinscricao, function(error, resultfuncoes2){											
										for(var i = 0; i < resultfuncoes2.length; i++){
											resultfuncoes2[i].datainicial = dateFormat(resultfuncoes2[i].datainicial, "dd/mm/yyyy");
											resultfuncoes2[i].datafinal = dateFormat(resultfuncoes2[i].datafinal, "dd/mm/yyyy");
										};										
										res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : 0, 
																		    inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
																			cursosInsc1 : resultcursos1, cursosInsc2 : resultcursos2,
																			funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2
										});
									});
								});
							} else {
								res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : 0,
																	inscricao1 : resultinscricoes[0], inscricao2 : [],
																	cursosInsc1 : resultcursos1, cursosInsc2 : [],
																	funcoesInsc1 : resultfuncoes1, funcoesInsc2 : []
								});
							};
						});							
					});
				} else {
					res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : 0,
														inscricao1 : [], inscricao2 : [],
														cursosInsc1 : [], cursosInsc2 : [],
														funcoesInsc1 : [], funcoesInsc2 : []
					});
				};
			});
		});				
	});		
};