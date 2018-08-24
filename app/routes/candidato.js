module.exports = function(application){	
    application.post('/candidato', function(req, res){
        application.app.controllers.inscricao.acessaInscricao(application, req, res);
    });
};