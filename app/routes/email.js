module.exports = function(application){	
	application.get('/email', function(req, res){
		application.app.controllers.email.acessaVerificacao(application, req, res);
  });
	
	application.post('/email', function(req, res){
		application.app.controllers.email.enviaVerificador(application, req, res);
	});
};