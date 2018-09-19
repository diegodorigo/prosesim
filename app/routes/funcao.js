module.exports = function(application){	
	application.post('/funcao', function(req, res){
		application.app.controllers.funcao.incluirFuncao(application, req, res);
	});
};