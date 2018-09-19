module.exports = function(application){	
    application.post('/inscricao_candidato', function(req, res){
        application.app.controllers.inscricao.acessaInscricao(application, req, res);
    });

    application.post('/Comprovante_candidato', function(req, res){
        application.app.controllers.inscricao.gerarPdf(application, req, res);
	});
};