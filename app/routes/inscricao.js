module.exports = function(application){	
	application.post('/salvar_inscricao', function(req, res){
		application.app.controllers.inscricao.salvaInscricao(application, req, res);
	});
	application.post('/excluir_inscricao', function(req, res){
		application.app.controllers.inscricao.excluirInscricao(application, req, res);
	});
	application.get('/verifica_inscricao', function(req, res){
		application.app.controllers.inscricao.verificarInscricao(application, req, res);
	});	
};