//module.exports.acessaCadastro = function(application, req, res) {
//	res.render("candidatos/cadastro", {validacao : {}, dadosForm : {}});
//};

module.exports.incluiCandidato = function(application, req, res) {
	var connection      = application.config.dbConnection();
	var CandidatosModel = new application.app.models.CandidatosDAO(connection); 
	var dadosForm       = req.body;
	var erros           = [];
	var cpfValid        = require('node-cpf-cnpj');	
		
	CandidatosModel.checkUser(dadosForm.cpf, function(error, result){
		if (result != ''){	
			erros = [{location: 'body', param: 'cpf', msg: 'CPF já cadastrado!', value: dadosForm.cpf}]
		};
		if (cpfValid.isValid(dadosForm.cpf) == false){	
			erros = [{location: 'body', param: 'cpf', msg: 'CPF inválido!', value: dadosForm.cpf}];
		};	
		
		req.assert('nome', 'Nome é obrigatório').notEmpty();
		req.assert('email', 'Email inválido').isEmail();
		req.assert('nascimento', 'Data de nascimento é obrigatória').notEmpty();
		req.assert('logradouro', 'Logradouro é obrigatório').notEmpty();
		req.assert('bairro', 'Bairro é obrigatório').notEmpty();
		req.assert('municipio', 'Município é obrigatório').notEmpty();
		req.assert('estado', 'Estado é obrigatório').notEmpty();
		req.assert('telefone1', 'Telefone é obrigatório').notEmpty();
		req.assert('senha', 'Senha é obrigatória').notEmpty();
		
		var errosExpress = req.validationErrors();
		if (errosExpress.length > 0){
			erros = erros.concat(errosExpress);
		};
		
		if(erros.length > 0){
			res.render("candidatos/cadastro", {validacao: erros, dadosForm: dadosForm});
			return;
		};

		CandidatosModel.salvarCandidato(dadosForm, function(error, result){
			var dateFormat = require('dateformat');
			CandidatosModel.getCandidato(dadosForm.cpf, function(error, resultcandidato){
				resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
				res.render("candidatos/candidato", {candidato : resultcandidato, 
					inscricao1 : [], inscricao2 : [],
					cursosInsc1 : [], cursosInsc2 : [],
					funcoesInsc1 : [], funcoesInsc2 : [],
					diasFuncao1 : 0, diasFuncao2 : 0,
					pontosCursos1 : 0, pontosCursos2 : 0,
					totalPontos1 : 0 , totalPontos2 : 0
				});
			});
		});   
	}); 
};	