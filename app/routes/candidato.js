module.exports = function(application){	
	application.post('/candidato', function(req, res){
		application.app.controllers.candidato.acessaCandidato(application, req, res);
	});
};
