module.exports = function(application){	
	application.post('/inscricao', function(req, res){
		application.app.controllers.inscricao.incluirInscricao(application, req, res);
	});
};