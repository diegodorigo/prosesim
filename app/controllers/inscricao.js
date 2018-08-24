module.exports.acessaInscricao = function(application, req, res) {
    var connection     = application.config.dbConnection();
    var AreasModel     = new application.app.models.AreasDAO(connection);
    var CursosModel    = new application.app.models.CursosDAO(connection);
    var FormacoesModel = new application.app.models.FormacoesDAO(connection);   

    FormacoesModel.listarFormacoes(function(error, resultformacoes){
        CursosModel.listarCursos(function(error, resultcursos){
            AreasModel.listarAreas(function(error, resultareas){
                res.render("candidatos/inscricao", {
                    validacao: {},
                    candidato: req.body, 
                    formacoes: resultformacoes, 
                    cursos: resultcursos,
                    areas: resultareas
                }); 
            });
        });           
    });    
};

module.exports.incluirInscricao = function(application, req, res) {    
    var connection      = application.config.dbConnection();
    var CandidatosModel = new application.app.models.CandidatosDAO(connection);
    var CursosModel     = new application.app.models.CursosDAO(connection);
    var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
    var dadosForm       = req.body;
    var dateFormat      = require('dateformat');  
    var erros           = [];
    var randomstring    = require('randomstring');    
    
    if(dadosForm.codigoarea == 0){
        erros = [{location: 'body', param: 'codigoarea', msg: 'Selecione uma área para realizar a inscrição!', value: dadosForm.codigoarea}];
    };   
    if(erros.length > 0){
        var connection     = application.config.dbConnection();
        var AreasModel     = new application.app.models.AreasDAO(connection);
        var CursosModel    = new application.app.models.CursosDAO(connection);
        var FormacoesModel = new application.app.models.FormacoesDAO(connection);      
        FormacoesModel.listarFormacoes(function(error, resultformacoes){
            CursosModel.listarCursos(function(error, resultcursos){
                AreasModel.listarAreas(function(error, resultareas){                    
                    res.render("candidatos/inscricao", {
                        validacao: erros,
                        candidato: req.body, 
                        formacoes: resultformacoes, 
                        cursos: resultcursos,
                        areas: resultareas
                    });                     
                });
            });           
        });  
        return;
    };
    
    protocolo = randomstring.generate({length: 15, charset:'numeric'});    
    CandidatosModel.salvarInscricao(dadosForm, protocolo, function(error, result){                             
        CandidatosModel.getInscricoesCandidato(dadosForm.codigocandidato, function(error, resultinscricoes){
            if (dadosForm.opcao == 1){
                CursosModel.deleteCursosInscricao(resultinscricoes[0].codigoinscricao, function(error, result){});
                CursosModel.salvarCurso(resultinscricoes[0].codigoinscricao, dadosForm.codigocurso1, function(error, result){});
                CursosModel.salvarCurso(resultinscricoes[0].codigoinscricao, dadosForm.codigocurso2, function(error, result){}); 
            } else {
                CursosModel.deleteCursosInscricao(resultinscricoes[1].codigoinscricao, function(error, result){});
                CursosModel.salvarCurso(resultinscricoes[1].codigoinscricao, dadosForm.codigocurso1, function(error, result){});
                CursosModel.salvarCurso(resultinscricoes[1].codigoinscricao, dadosForm.codigocurso2, function(error, result){}); 
            };
        });
    });
    //RECUPERA O CANDIDATO
    CandidatosModel.getCandidato(dadosForm.cpf, function(error, resultcandidato){        
        resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
        //RECUPERA AS INSCRIÇÕES DO CANDIDATO        
        CandidatosModel.getInscricoesCandidato(resultcandidato[0].codigocandidato, function(error, resultinscricoes){	
            if (resultinscricoes[0] != null) {
                resultinscricoes[0].datainscricao = dateFormat(resultinscricoes[0].datainscricao, "dd/mm/yyyy - HH:MM");
                //RECUPERA CURSOS DA INSCRIÇÃO 1                               
                CursosModel.getCursosInscricao(resultinscricoes[0].codigoinscricao, function(error, resultcursos1){	
                    var pontosCursos1 = 0;
                    for(var i = 0; i < resultcursos1.length; i++){								
                        pontosCursos1 = pontosCursos1 + resultcursos1[i].pontoscursos;
                    };                           
                    //RECUPERA FUNÇÕES DA INSCRIÇÃO 1
                    FuncoesModel.getFuncoesInscricao(resultinscricoes[0].codigoinscricao, function(error, resultfuncoes1){
                        var diasFuncao1 = 0;
                        for(var i = 0; i < resultfuncoes1.length; i++){
                            resultfuncoes1[i].datainicial = dateFormat(resultfuncoes1[i].datainicial, "dd/mm/yyyy");
                            resultfuncoes1[i].datafinal = dateFormat(resultfuncoes1[i].datafinal, "dd/mm/yyyy");
                            diasFuncao1 = diasFuncao1 + resultfuncoes1[i].totaldias;
                        };	
                        diasFuncao1 = diasFuncao1 * 0.01;
                        if (diasFuncao1 > 10) {
                            diasFuncao1 = 10.0;
                        };  							
                        if (resultinscricoes[1] != null) {
                            resultinscricoes[1].datainscricao = dateFormat(resultinscricoes[1].datainscricao, "dd/mm/yyyy - HH:MM");
                            //RECUPERA CURSOS DA INSCRIÇÃO 2
                            CursosModel.getCursosInscricao(resultinscricoes[1].codigoinscricao, function(error, resultcursos2){	  
                                var pontosCursos2 = 0;
                                for(var i = 0; i < resultcursos2.length; i++){								
                                    pontosCursos2 = pontosCursos2 + resultcursos2[i].pontoscursos;
                                };                             
                                //RECUPERA FUNÇÕES DA INSCRIÇÃO 2
                                FuncoesModel.getFuncoesInscricao(resultinscricoes[1].codigoinscricao, function(error, resultfuncoes2){											
                                    var diasFuncao2 = 0;
                                    for(var i = 0; i < resultfuncoes2.length; i++){
                                        resultfuncoes2[i].datainicial = dateFormat(resultfuncoes2[i].datainicial, "dd/mm/yyyy");
                                        resultfuncoes2[i].datafinal = dateFormat(resultfuncoes2[i].datafinal, "dd/mm/yyyy");
                                        diasFuncao2 = diasFuncao2 + resultfuncoes2[i].totaldias;
                                    };
                                    diasFuncao2 = diasFuncao2 * 0.01;
                                    if (diasFuncao2 > 10) {
                                        diasFuncao2 = 10.0;
                                    };
                                    res.render("candidatos/candidato", {candidato : resultcandidato, 
                                        inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
                                        cursosInsc1 : resultcursos1,	cursosInsc2 : resultcursos2,
                                        funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2,
                                        diasFuncao1 : diasFuncao1, diasFuncao2 : diasFuncao2,
                                        pontosCursos1 : pontosCursos1, pontosCursos2 : pontosCursos2,
                                        totalPontos1 : diasFuncao1 + pontosCursos1 + resultinscricoes[0].pontosformacao,
                                        totalPontos2 : diasFuncao2 + pontosCursos2 + resultinscricoes[1].pontosformacao
                                    });
                                });
                            });
                        } else {
                            res.render("candidatos/candidato", {candidato : resultcandidato, 
                                inscricao1 : resultinscricoes[0], inscricao2 : [],
                                cursosInsc1 : resultcursos1, cursosInsc2 : [],
                                funcoesInsc1 : resultfuncoes1, funcoesInsc2 : [],
                                diasFuncao1 : diasFuncao1, diasFuncao2 : 0,
                                pontosCursos1 : pontosCursos1, pontosCursos2 : 0,
                                totalPontos1 : diasFuncao1 + pontosCursos1 + resultinscricoes[0].pontosformacao,
                                totalPontos2 : 0
                            });
                        };
                    });							
                });
            } else {
                res.render("candidatos/candidato", {candidato : resultcandidato, 
                    inscricao1 : [], inscricao2 : [],
                    cursosInsc1 : [], cursosInsc2 : [],
                    funcoesInsc1 : [], funcoesInsc2 : [],
                    diasFuncao1 : 0, diasFuncao2 : 0,
                    pontosCursos1 : 0, pontosCursos2 : 0,
                    totalPontos1 : 0, totalPontos2 : 0
                });
            };
        });
    });	
};

