module.exports = function(application){	
	/*application.get('/cadastro', function(req, res){
		application.app.controllers.cadastro.acessaCadastro(application, req, res);
	});*/

	application.post('/cadastro', function(req, res){
		application.app.controllers.cadastro.incluiCandidato(application, req, res);
	});
};