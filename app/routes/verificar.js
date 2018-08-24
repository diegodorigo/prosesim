module.exports = function(application){	
	application.post('/verificar', function(req, res){
		application.app.controllers.verificar.acessaCadastro(application, req, res);
	});
};