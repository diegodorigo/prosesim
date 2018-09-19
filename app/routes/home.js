module.exports = function(application){
	application.get('/', function(req, res){
		application.app.controllers.home.index(application, req, res);
	});

	application.post('/dados_candidato', function(req, res){		
		application.app.controllers.home.acessaCandidato(application, req, res);
	});

	application.post('/recupera_senha', function(req, res){
		application.app.controllers.home.recuperaSenha(application, req, res);
	});
};