module.exports = function(application){	
	application.get('/cadastro', function(req, res){
		application.app.controllers.candidato.incluiCandidato(application, req, res);
	});
};