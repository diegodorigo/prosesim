module.exports.acessaCandidato = function(application, req, res) {
	
	var dadosForm = req.body;

	req.assert('cpf', 'CPF é obrigatório').notEmpty();

	var erros = req.validationErrors();
	if (erros){
		res.render("home/index", {validacao : erros});
		return;
	};

	var connection = application.config.dbConnection();
	var ProsesimModel = new application.app.models.ProsesimDAO(connection);

	ProsesimModel.getCandidato(function(error, result){
		res.render("candidatos/candidato", {candidato : result});	
	});	
};

module.exports.incluiCandidato = function(application, req, res) {
	res.render("candidatos/cadastro");	
};