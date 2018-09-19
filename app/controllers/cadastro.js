module.exports.salvarCandidato = function(application, req, res) {
	var connection      = application.config.dbConnection();
	var CandidatosModel = new application.app.models.CandidatosDAO(connection); 
	var dadosForm       = req.body;
	var erros           = [];
	var cpfValid        = require('node-cpf-cnpj');	
	var datainicialvalida = new Date("1950-01-01");
	var datafinalvalida   = new Date("2000-01-01");
	var newnascimento = new Date(dadosForm.nascimento);
	var dateFormat = require('dateformat');

	
	CandidatosModel.checkUser(dadosForm.cpf, function(error, result){
		if (dadosForm.acao == 1){
			if (result != ''){	
				erros = [{location: 'body', param: 'cpf', msg: 'CPF já cadastrado!', value: dadosForm.cpf}]
			};
		};
		if (cpfValid.isValid(dadosForm.cpf) == false){	
			erros = [{location: 'body', param: 'cpf', msg: 'CPF inválido!', value: dadosForm.cpf}];
		};
		if ( (newnascimento.valueOf() < datainicialvalida.valueOf()) | (newnascimento.valueOf() > datafinalvalida.valueOf()) ){
			var errodata = [{location: 'body', param: 'nascimento', msg: 'Data de nascimento inválida!', value: dadosForm.nascimento}];
			erros = erros.concat(errodata);
		};
		if ((dadosForm.deficiente == 'Sim' ) && (dadosForm.deficiencia == '')){
			var errodef = [{location: 'body', param: 'deficiencia', msg: 'O preenchimento do campo "Tipo de Deficiência" é obrigatório.', value: dadosForm.deficiencia}];
			erros = erros.concat(errodef);
		};
		
		req.assert('nome', 'O preenchimento do campo "Nome" é obrigatório').notEmpty();
		req.assert('email', 'Email inválido.').isEmail();
		req.assert('nascimento', 'O preenchimento do campo "Data de nascimento" é obrigatório.').notEmpty();
		req.assert('logradouro', 'O preenchimento do campo "Logradouro" é obrigatório.').notEmpty();
		req.assert('bairro', 'O preenchimento do campo "Bairro" é obrigatório.').notEmpty();
		req.assert('municipio', 'O preenchimento do campo "Município" é obrigatório.').notEmpty();
		req.assert('estado', 'O preenchimento do campo "Estado" é obrigatório.').notEmpty();
		req.assert('telefone1', 'O preenchimento do campo "Telefone 1" é obrigatório.').notEmpty();		
		req.assert('senha', 'O preenchimento do campo "Senha" é obrigatório.').notEmpty();
				
		var errosExpress = req.validationErrors();
		if (errosExpress.length > 0){
			erros = erros.concat(errosExpress);
		};
		
		if(erros.length > 0){
			res.render("candidatos/cadastro", {acao : dadosForm.acao, validacao: erros, dadosForm: dadosForm});
			return;
		};

		if (dadosForm.deficiente == 'Não') {
			dadosForm.deficiencia = '';
		};

		if (dadosForm.acao == 1){
			CandidatosModel.incluirCandidato(dadosForm, function(error, result){				
				
				for (var i = 1; i <= 2 ; i++) {	
					var inscricao = { codigocandidato: result.insertId, opcao: i, codigoformacao: 4, codigoarea: 0, protocolo: "''" };
					CandidatosModel.insereInscricao(inscricao, function(error, resultinscricao){});
				};

				CandidatosModel.getCandidato(dadosForm.cpf, 0, function(error, resultcandidato){
					resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
					CandidatosModel.getInscricoesCandidato(resultcandidato[0].codigocandidato, function(error, resultinscricoes){
						res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick: 0,
							inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
							cursosInsc1 : [], cursosInsc2 : [],
							funcoesInsc1 : [], funcoesInsc2 : []
						});
					});
				});
			}); 
		} else {
			CandidatosModel.alterarCandidato(dadosForm, function(error, result){
				//RECUPERA O CANDIDATO				
				var CursosModel     = new application.app.models.CursosDAO(connection);
				var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
				CandidatosModel.getCandidato(dadosForm.cpf, 0, function(error, resultcandidato){
					resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
					//RECUPERA AS INSCRIÇÕES DO CANDIDATO
					CandidatosModel.getInscricoesCandidato(resultcandidato[0].codigocandidato, function(error, resultinscricoes){
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
												res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick: 0,
																					inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
																					cursosInsc1 : resultcursos1,	cursosInsc2 : resultcursos2,
																					funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2
												});
											});
										});
									} else {
										res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick: 0,
																			inscricao1 : resultinscricoes[0], inscricao2 : [],
																			cursosInsc1 : resultcursos1, cursosInsc2 : [],
																			funcoesInsc1 : resultfuncoes1, funcoesInsc2 : [] 
										});
									};
								});							
							});
						} else {
							res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick: 0,
																inscricao1 : [], inscricao2 : [],
																cursosInsc1 : [], cursosInsc2 : [],
																funcoesInsc1 : [], funcoesInsc2 : []
							});
						};
					});
				});
			}); 
		};  
	}); 
};	

module.exports.acessaAlteracao = function(application, req, res) {
	var connection      = application.config.dbConnection();
	var CandidatosModel = new application.app.models.CandidatosDAO(connection); 
	var dadosForm       = req.body;
	var dateFormat 	    = require('dateformat');

	CandidatosModel.getCandidato(dadosForm.cpf, 0, function(error, resultcandidato){
		resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "yyyy-mm-dd");
		res.render("candidatos/cadastro", {acao : 2,  validacao: {}, dadosForm: resultcandidato[0]});
	});
};