module.exports = function(application){	
	application.get('/inscricao', function(req, res){
		application.app.controllers.inscricao.acessaInscricao(application, req, res);
	});

	application.post('/inscricao', function(req, res){
		application.app.controllers.inscricao.acessaInscricao(application, req, res);
	});
};