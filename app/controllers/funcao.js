module.exports.incluirFuncao = function(application, req, res) {
    var connection      = application.config.dbConnection();
    var CandidatosModel = new application.app.models.CandidatosDAO(connection);
    var CursosModel     = new application.app.models.CursosDAO(connection);
    var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
    var dadosForm       = req.body;
    var dateFormat      = require('dateformat');  
    var erros           = [];    
    var datainicialvalida = new Date("2013-01-01");
    var datafinalvalida   = new Date("2018-10-31");
    var newdatainicial = new Date(dadosForm.newdatainicial);
    var newdatafinal = new Date(dadosForm.newdatafinal);   
    
    // Verifica se a nova data inicial informada é maior que a última data inserida
    FuncoesModel.getUltimaData(dadosForm.codigoinscricao, function(error, result){ 
        
        if (result[0].ultimadata != null){ 
            if (newdatainicial.valueOf() <= result[0].ultimadata.valueOf()){
                var errodatapos = [{location: 'body', param: 'newdatainicial', msg: 'A data inicial da nova função deve ser maior que a data final da última função informada!', value: dadosForm.newdatainicial}];
                erros = erros.concat(errodatapos);
            };   
        };
        // Verifica se a nova data inicial informada está dentro do período permitido
        if ( (newdatainicial.valueOf() < datainicialvalida.valueOf()) | (newdatainicial.valueOf() > datafinalvalida.valueOf()) ) {        
            var errodatainicial = [{location: 'body', param: 'newdatainicial', msg: 'A data inicial da nova função deve estar entre o período 01/01/2013 e 31/10/2018!', value: dadosForm.newdatainicial}];
            erros = erros.concat(errodatainicial);
        };
        // Verifica se a nova data final informada está dentro do período permitido
        if ( (newdatafinal.valueOf() < datainicialvalida.valueOf()) | (newdatafinal.valueOf() > datafinalvalida.valueOf()) ) {        
            var errodatafinal = [{location: 'body', param: 'newdatafinal', msg: 'A data final da nova função deve estar entre o período 01/01/2013 e 31/10/2018!', value: dadosForm.newdatafinal}];
            erros = erros.concat(errodatafinal);
        };
        // Verifica se a data final é menor que a data inicial
        if (newdatafinal.valueOf() <= newdatainicial.valueOf()){
            var errodatamenor = [{location: 'body', param: 'newdatainicial', msg: 'A data final deve ser maior que a data inicial!', value: dadosForm.newdatainicial}];
            erros = erros.concat(errodatamenor);
        };
        // Verifica se os campos estão preenchidos
        req.assert('newdescricao', 'A descrição da nova função é obrigatória').notEmpty();
        req.assert('newdatainicial', 'Data inicial da nova função é obrigatória').notEmpty();
        req.assert('newdatafinal', 'Data final da nova função é obrigatória').notEmpty();
        var errosExpress = req.validationErrors();
        if (errosExpress.length > 0){
            erros = erros.concat(errosExpress);
        };        
        // Se não houver erros, insere a função
        if (erros.length <= 0){
            // Calcula os dias da função
            var tempoDif = Math.abs(newdatafinal.valueOf() - newdatainicial.valueOf());
            var newtotaldias = Math.ceil((tempoDif / (1000 * 3600 * 24))+1); 
            FuncoesModel.salvarFuncao(dadosForm.codigoinscricao, dadosForm.newdescricao, dadosForm.newdatainicial, dadosForm.newdatafinal, newtotaldias, function(error, result){});
        };
    });

    //RECUPERA O CANDIDATO
    CandidatosModel.getCandidato('', dadosForm.codigocandidato, function(error, resultcandidato){        
        resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
        //RECUPERA AS INSCRIÇÕES DO CANDIDATO        
        CandidatosModel.getInscricoesCandidato(resultcandidato[0].codigocandidato, function(error, resultinscricoes){	
            //INSCRIÇÃO 1
            if (resultinscricoes[0] != null) {
                resultinscricoes[0].datainscricao = dateFormat(resultinscricoes[0].datainscricao, "dd/mm/yyyy - HH:MM");
                //RECUPERA CURSOS DA INSCRIÇÃO 1                               
                CursosModel.getCursosInscricao(resultinscricoes[0].codigoinscricao, function(error, resultcursos1){	
                    //RECUPERA FUNÇÕES DA INSCRIÇÃO 1
                    FuncoesModel.getFuncoesInscricao(resultinscricoes[0].codigoinscricao, function(error, resultfuncoes1){
                        for(var i = 0; i < resultfuncoes1.length; i++){
                            resultfuncoes1[i].datainicial = dateFormat(resultfuncoes1[i].datainicial, "dd/mm/yyyy");
                            resultfuncoes1[i].datafinal = dateFormat(resultfuncoes1[i].datafinal, "dd/mm/yyyy");
                        };	
                        //INSCRIÇÃO 2
                        if (resultinscricoes[1] != null) {
                            resultinscricoes[1].datainscricao = dateFormat(resultinscricoes[1].datainscricao, "dd/mm/yyyy - HH:MM");
                            //RECUPERA CURSOS DA INSCRIÇÃO 2
                            CursosModel.getCursosInscricao(resultinscricoes[1].codigoinscricao, function(error, resultcursos2){	  
                                //RECUPERA FUNÇÕES DA INSCRIÇÃO 2
                                FuncoesModel.getFuncoesInscricao(resultinscricoes[1].codigoinscricao, function(error, resultfuncoes2){											
                                    for(var i = 0; i < resultfuncoes2.length; i++){
                                        resultfuncoes2[i].datainicial = dateFormat(resultfuncoes2[i].datainicial, "dd/mm/yyyy");
                                        resultfuncoes2[i].datafinal = dateFormat(resultfuncoes2[i].datafinal, "dd/mm/yyyy");
                                    };
                                    res.render("candidatos/candidato", {validacao : erros, candidato : resultcandidato, acaoclick: 0, 
                                                                        inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
                                                                        cursosInsc1 : resultcursos1, cursosInsc2 : resultcursos2,
                                                                        funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2
                                    });
                                });
                            });
                        } else {
                            res.render("candidatos/candidato", {validacao : erros, candidato : resultcandidato, acaoclick: 0, 
                                                                inscricao1 : resultinscricoes[0], inscricao2 : [],
                                                                cursosInsc1 : resultcursos1, cursosInsc2 : [],
                                                                funcoesInsc1 : resultfuncoes1, funcoesInsc2 : []
                            });
                        };
                    });							
                });
            } else {
                res.render("candidatos/candidato", {validacao : erros, candidato : resultcandidato, acaoclick: 0, 
                                                    inscricao1 : [], inscricao2 : [],
                                                    cursosInsc1 : [], cursosInsc2 : [],
                                                    funcoesInsc1 : [], funcoesInsc2 : []
                });
            };
        });
    });	    
};	