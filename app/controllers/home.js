module.exports.index = function(application, req, res){
	res.render("home/index", {validacao:{}, informacao : {}, dadosForm: {}});
};

module.exports.acessaCandidato = function(application, req, res) {
	var connection      = application.config.dbConnection();
	var CandidatosModel = new application.app.models.CandidatosDAO(connection);
	var CursosModel     = new application.app.models.CursosDAO(connection);
	var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
	var dadosForm       = req.body;
	var erros           = [];	
	
	if (dadosForm.remember){
		CandidatosModel.checkUser(dadosForm.cpf, function(error, result){
			if (result == ''){
				erros = [{location: 'body', param: 'cpf', msg: 'CPF não cadastrado!', value: dadosForm.cpf}];
			};	
	
			if (erros.length > 0){				
				res.render("home/index", {validacao : erros, informacao : {}, dadosForm: dadosForm});
				return;
			};
			
			CandidatosModel.getCandidato(dadosForm.cpf, function(error, result){
		  
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
		return;	
	} else {
		CandidatosModel.checkUser(dadosForm.cpf, function(error, result){
			if (result == ''){
				erros = [{location: 'body', param: 'cpf', msg: 'CPF não cadastrado!', value: dadosForm.cpf}];
			} else{
				if (dadosForm.senha != result[0].senha){
					erros = [{location: 'body', param: 'senha', msg: 'Senha inválida!', value: dadosForm.senha}];
				};
			};	
	
			if (erros.length > 0){
				res.render("home/index", {validacao : erros, informacao : {}, dadosForm: dadosForm});
				return;
			};
			
			var dateFormat = require('dateformat');
			//RECUPERA O CANDIDATO
			CandidatosModel.getCandidato(dadosForm.cpf, function(error, resultcandidato){
				resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
				//RECUPERA AS INSCRIÇÕES DO CANDIDATO
				CandidatosModel.getInscricoesCandidato(resultcandidato[0].codigocandidato, function(error, resultinscricoes){
					if (resultinscricoes[0] != null) {
						resultinscricoes[0].datainscricao = dateFormat(resultinscricoes[0].datainscricao, "dd/mm/yyyy - HH:MM");		
						//RECUPERA CURSOS DA INSCRIÇÃO 1
						CursosModel.getCursosInscricao(resultinscricoes[0].codigoinscricao, function(error, resultcursos1){	
							var pontosCursos1 = 0;
							for(var i = 0; i < resultcursos1.length; i++){								
								pontosCursos1 = pontosCursos1 + resultcursos1[i].pontoscursos;
							};
							//RECUPERA FUNÇÕES DA INSCRIÇÃO 1
							FuncoesModel.getFuncoesInscricao(resultinscricoes[0].codigoinscricao, function(error, resultfuncoes1){
								var diasFuncao1 = 0;
								for(var i = 0; i < resultfuncoes1.length; i++){
									resultfuncoes1[i].datainicial = dateFormat(resultfuncoes1[i].datainicial, "dd/mm/yyyy");
									resultfuncoes1[i].datafinal = dateFormat(resultfuncoes1[i].datafinal, "dd/mm/yyyy");
									diasFuncao1 = diasFuncao1 + resultfuncoes1[i].totaldias;
								};	
								diasFuncao1 = diasFuncao1 * 0.01;
								if (diasFuncao1 > 10) {
									diasFuncao1 = 10.0;
								};						
								if (resultinscricoes[1] != null) {
									resultinscricoes[1].datainscricao = dateFormat(resultinscricoes[1].datainscricao, "dd/mm/yyyy - HH:MM");
									//RECUPERA CURSOS DA INSCRIÇÃO 2
									CursosModel.getCursosInscricao(resultinscricoes[1].codigoinscricao, function(error, resultcursos2){
										var pontosCursos2 = 0;
										for(var i = 0; i < resultcursos2.length; i++){								
											pontosCursos2 = pontosCursos2 + resultcursos2[i].pontoscursos;
										};	
										//RECUPERA FUNÇÕES DA INSCRIÇÃO 2
										FuncoesModel.getFuncoesInscricao(resultinscricoes[1].codigoinscricao, function(error, resultfuncoes2){											
											var diasFuncao2 = 0;
											for(var i = 0; i < resultfuncoes2.length; i++){
												resultfuncoes2[i].datainicial = dateFormat(resultfuncoes2[i].datainicial, "dd/mm/yyyy");
												resultfuncoes2[i].datafinal = dateFormat(resultfuncoes2[i].datafinal, "dd/mm/yyyy");
												diasFuncao2 = diasFuncao2 + resultfuncoes2[i].totaldias;
											};
											diasFuncao2 = diasFuncao2 * 0.01;
											if (diasFuncao2 > 10) {
												diasFuncao2 = 10.0;
											};
											res.render("candidatos/candidato", {candidato : resultcandidato, 
												inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
												cursosInsc1 : resultcursos1,	cursosInsc2 : resultcursos2,
												funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2,
												diasFuncao1 : diasFuncao1, diasFuncao2 : diasFuncao2,
												pontosCursos1 : pontosCursos1, pontosCursos2 : pontosCursos2,
												totalPontos1 : diasFuncao1 + pontosCursos1 + resultinscricoes[0].pontosformacao,
                    							totalPontos2 : diasFuncao2 + pontosCursos2 + resultinscricoes[1].pontosformacao
											});
										});
									});
								} else {
									res.render("candidatos/candidato", {candidato : resultcandidato, 
										inscricao1 : resultinscricoes[0], inscricao2 : [],
										cursosInsc1 : resultcursos1, cursosInsc2 : [],
										funcoesInsc1 : resultfuncoes1, funcoesInsc2 : [],
										diasFuncao1 : diasFuncao1, diasFuncao2 : 0,
										pontosCursos1 : pontosCursos1, pontosCursos2 : 0,
										totalPontos1 : diasFuncao1 + pontosCursos1 + resultinscricoes[0].pontosformacao,
                    					totalPontos2 : 0 
									});
								};
							});							
						});
					} else {
						res.render("candidatos/candidato", {candidato : resultcandidato, 
							inscricao1 : [], inscricao2 : [],
							cursosInsc1 : [], cursosInsc2 : [],
							funcoesInsc1 : [], funcoesInsc2 : [],
							diasFuncao1 : 0, diasFuncao2 : 0,
							pontosCursos1 : 0, pontosCursos2 : 0,
							totalPontos1 : 0, totalPontos2 : 0
						});
					};
				});
			});				
		});			
	};
};