module.exports = function(application){	
	application.post('/cadastro_salvar', function(req, res){
		application.app.controllers.cadastro.salvarCandidato(application, req, res);
	});

	application.post('/cadastro_update', function(req, res){
		application.app.controllers.cadastro.acessaAlteracao(application, req, res);
	});
};