module.exports.acessaCadastro = function(application, req, res) {
	res.render("candidatos/cadastro", { validacao : {}, dadosForm : {}});
};

module.exports.incluiCandidato = function(application, req, res) {
    
	var dadosForm = req.body;
	var erros = [];

	var cpfValid = require('node-cpf-cnpj');
	if (cpfValid.isValid(dadosForm.cpf) == false){		
		erros = [{location: 'body', param: 'cpf', msg: 'CPF inválido!', value: dadosForm.cpf}];
	};

	req.assert('nome', 'Nome é obrigatório').notEmpty();
	req.assert('email', 'Email é obrigatório').notEmpty();
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
	
    var connection = application.config.dbConnection();
	var ProsesimModel = new application.app.models.ProsesimDAO(connection);

	ProsesimModel.salvarCandidato(dadosForm, function(error, result){
		ProsesimModel.getCandidato(dadosForm.cpf, function(error, result){
			res.render("candidatos/candidato", {candidato : result});
		});
	});    
};
