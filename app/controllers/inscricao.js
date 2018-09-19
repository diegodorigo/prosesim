module.exports.acessaInscricao = function(application, req, res) {
    var connection      = application.config.dbConnection();
    var AreasModel      = new application.app.models.AreasDAO(connection);
    var CursosModel     = new application.app.models.CursosDAO(connection);
    var FormacoesModel  = new application.app.models.FormacoesDAO(connection);  
    var dadosForm       = req.body;
    
    FormacoesModel.listarFormacoes(function(error, resultformacoes){
        CursosModel.listarCursos(function(error, resultcursos){
            AreasModel.listarAreas(function(error, resultareas){
                res.render("candidatos/inscricao", {
                    validacao: {},
                    dadosForm: dadosForm,
                    formacoes: resultformacoes, 
                    cursos: resultcursos,
                    areas: resultareas,
                    funcoes: [], soma: 0
                }); 
            });
        });           
    });         
};

module.exports.salvaInscricao = function(application, req, res) {    
    var connection      = application.config.dbConnection();
    var CandidatosModel = new application.app.models.CandidatosDAO(connection);    
    var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
    var dadosForm       = req.body;
    var dateFormat      = require('dateformat');  
    var erros           = [];
    var randomstring    = require('randomstring'); 
    var protocolo       = randomstring.generate({length: 15, charset:'numeric'});
    
    CandidatosModel.verificaInscricaoConcluida(dadosForm.codigoinscricao, function(error, result){        
        if (result[0].concluida == 1) {
            //RECUPERA O CANDIDATO
            var CursosModel = new application.app.models.CursosDAO(connection);
            CandidatosModel.getCandidato('', dadosForm.codigocandidato, function(error, resultcandidato){ 
                resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
                //RECUPERA AS INSCRIÇÕES DO CANDIDATO 
                var CandidatosModel = new application.app.models.CandidatosDAO(connection);        
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
                                            res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : dadosForm.opcao,
                                                                                inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
                                                                                cursosInsc1 : resultcursos1, cursosInsc2 : resultcursos2,
                                                                                funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2
                                            });
                                        });
                                    });
                                } else {
                                    res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : dadosForm.opcao, 
                                                                        inscricao1 : resultinscricoes[0], inscricao2 : [],
                                                                        cursosInsc1 : resultcursos1, cursosInsc2 : [],
                                                                        funcoesInsc1 : resultfuncoes1, funcoesInsc2 : []
                                    });
                                };
                            });							
                        });
                    } else {
                        res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : dadosForm.opcao, 
                                                            inscricao1 : [], inscricao2 : [],
                                                            cursosInsc1 : [], cursosInsc2 : [],
                                                            funcoesInsc1 : [], funcoesInsc2 : []
                        });
                    };
                });
            });   
        } else {
            CandidatosModel.verificaInscricaoRepetida(dadosForm.codigocandidato, dadosForm.codigoarea, function(error, resultverifica){
                if (dadosForm.codigoarea == 0) {
                    erros = [{location: 'body', param: 'codigoarea', msg: 'Selecione uma área para realizar a inscrição!', value: dadosForm.codigoarea}];
                } else {
                    if(resultverifica != ''){
                        erros = [{location: 'body', param: 'codigoarea', msg: 'A área selecionada deve ser diferente da área da primeira opção!', value: dadosForm.codigoarea}];
                    };
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
                                    dadosForm: dadosForm,
                                    formacoes: resultformacoes, 
                                    cursos: resultcursos,
                                    areas: resultareas
                                });                     
                            });
                        });           
                    });  
                    return;
                };      
        
                var inscricao = { codigocandidato: dadosForm.codigocandidato, codigoinscricao: dadosForm.codigoinscricao, codigoformacao: dadosForm.codigoformacao, codigoarea: dadosForm.codigoarea, protocolo: protocolo };
                CandidatosModel.alteraInscricao(inscricao, function(error, result){  
                   
                    var connection  = application.config.dbConnection();                
                    var CursosModel = new application.app.models.CursosDAO(connection);
                    CursosModel.deleteCursosInscricao(dadosForm.codigoinscricao, function(error, result){});
                    CursosModel.salvarCurso(dadosForm.codigoinscricao, dadosForm.codigocurso1, function(error, result){});
                    CursosModel.salvarCurso(dadosForm.codigoinscricao, dadosForm.codigocurso2, function(error, result){}); 
                    
                    //RECUPERA O CANDIDATO
                    CandidatosModel.getCandidato('', dadosForm.codigocandidato, function(error, resultcandidato){ 
                        resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");
                        //RECUPERA AS INSCRIÇÕES DO CANDIDATO 
                        var CandidatosModel = new application.app.models.CandidatosDAO(connection);        
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
                                                    res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : dadosForm.opcao,
                                                                                        inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
                                                                                        cursosInsc1 : resultcursos1, cursosInsc2 : resultcursos2,
                                                                                        funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2
                                                    });
                                                });
                                            });
                                        } else {
                                            res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : dadosForm.opcao,
                                                                                inscricao1 : resultinscricoes[0], inscricao2 : [],
                                                                                cursosInsc1 : resultcursos1, cursosInsc2 : [],
                                                                                funcoesInsc1 : resultfuncoes1, funcoesInsc2 : []
                                            });
                                        };
                                    });							
                                });
                            } else {
                                res.render("candidatos/candidato", {validacao : {}, candidato : resultcandidato, acaoclick : dadosForm.opcao,
                                                                    inscricao1 : [], inscricao2 : [],
                                                                    cursosInsc1 : [], cursosInsc2 : [],
                                                                    funcoesInsc1 : [], funcoesInsc2 : []
                                });
                            };
                        });
                    });
                });      
            });
        };
    });   
};

module.exports.excluirInscricao = function(application, req, res) {
    res.send(req.body);
};

module.exports.verificarInscricao = function(application, req, res) {
    var dadosForm = req.query;
    var connection      = application.config.dbConnection();
    var CandidatosModel = new application.app.models.CandidatosDAO(connection);
    var CursosModel    = new application.app.models.CursosDAO(connection);
    var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
    var dateFormat      = require('dateformat');  
    
    CandidatosModel.getCandidato('', dadosForm.id, function(error, resultcandidato){ 
        resultcandidato[0].nascimento = dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy");        
        CandidatosModel.getInscricoesCandidato(dadosForm.id, function(error, resultinscricoes){
            //INSCRIÇÃO 1
            if (resultinscricoes[0] != null) {
                resultinscricoes[0].datainscricao = dateFormat(resultinscricoes[0].datainscricao, "dd/mm/yyyy - HH:MM");
                CursosModel.getCursosInscricao(resultinscricoes[0].codigoinscricao, function(error, resultcursos1){	
                    FuncoesModel.getFuncoesInscricao(resultinscricoes[0].codigoinscricao, function(error, resultfuncoes1){
                        for(var i = 0; i < resultfuncoes1.length; i++){
                            resultfuncoes1[i].datainicial = dateFormat(resultfuncoes1[i].datainicial, "dd/mm/yyyy");
                            resultfuncoes1[i].datafinal = dateFormat(resultfuncoes1[i].datafinal, "dd/mm/yyyy");
                        };
                        //INSCRIÇÃO 2
                        if (resultinscricoes[1] != null) {
                            resultinscricoes[1].datainscricao = dateFormat(resultinscricoes[1].datainscricao, "dd/mm/yyyy - HH:MM");
                            CursosModel.getCursosInscricao(resultinscricoes[1].codigoinscricao, function(error, resultcursos2){
                                FuncoesModel.getFuncoesInscricao(resultinscricoes[1].codigoinscricao, function(error, resultfuncoes2){ 
                                    for(var i = 0; i < resultfuncoes2.length; i++){
                                        resultfuncoes2[i].datainicial = dateFormat(resultfuncoes2[i].datainicial, "dd/mm/yyyy");
                                        resultfuncoes2[i].datafinal = dateFormat(resultfuncoes2[i].datafinal, "dd/mm/yyyy");
                                    };                           
                                    res.render("candidatos/validacao", {candidato : resultcandidato, 
                                                                        inscricao1 : resultinscricoes[0], inscricao2 : resultinscricoes[1],
                                                                        cursosInsc1 : resultcursos1, cursosInsc2 : resultcursos2,
                                                                        funcoesInsc1 : resultfuncoes1, funcoesInsc2 : resultfuncoes2
                                    });    
                                });
                            });
                        } else {
                            res.render("candidatos/validacao", {candidato : resultcandidato, 
                                                                inscricao1 : resultinscricoes[0], inscricao2 : [],
                                                                cursosInsc1 : resultcursos1, cursosInsc2 : [],
                                                                funcoesInsc1 : resultfuncoes1, funcoesInsc2 : []
                            });
                        };                    
                    });
                });
            } else {
                res.render("candidatos/validacao", {candidato : resultcandidato, 
                                                    inscricao1 : [], inscricao2 : [],
                                                    cursosInsc1 : [], cursosInsc2 : [],
                                                    funcoesInsc1 : [], funcoesInsc2 : []
                });
            };
        });
    }); 
};

module.exports.gerarPdf = function(application, req, res) {    
    var dadosForm = req.body; 
    var QRCode = require('qrcode');    
    QRCode.toFile("./app/public/images/qrcode.png", 
                  'http://170.254.245.102:3000/verifica_inscricao?id='+dadosForm.codigocandidato,
                  /*' - CPF: ' + dadosForm.cpf + '\n' +
                  ' - Pontuação: ' + dadosForm.totalPontos + '\n' + 
                  ' - Data/Hora: ' + dadosForm.datainscricao + '\n' +
                  ' - Protocolo: ' + dadosForm.protocolo ,*/ 
                  {color: {dark: '#000000', light: '#FFFFFF'}}, 
                  function (err) {if (err) throw err       
        
        var CandidatosModel = new application.app.models.CandidatosDAO(connection);
        var CursosModel     = new application.app.models.CursosDAO(connection);
        var FuncoesModel    = new application.app.models.FuncoesDAO(connection);
        var dateFormat      = require('dateformat');  
        
        CandidatosModel.getCandidato(dadosForm.cpf, dadosForm.codigocandidato, function(error, resultcandidato){
            CandidatosModel.getInscricaoCandidato(dadosForm.codigoinscricao, function(error, resultinscricao){
                CursosModel.getCursosInscricao(dadosForm.codigoinscricao, function(error, resultcursos){
                    FuncoesModel.getFuncoesInscricao(dadosForm.codigoinscricao, function(error, resultfuncoes){ 
                        
                        PDFDocument = require('pdfkit');            
                        var doc = new PDFDocument();
                        doc.lineWidth(0.1);   
                        doc.image("./app/public/images/logo.jpg", 200, 5, {scale: 0.75}).moveDown(1);
                        doc.image("./app/public/images/qrcode.png", 525, 5, {scale: 0.5});
                        doc.fontSize(15); doc.text('PROCESSO SELETIVO SIMPLIFICADO - EDITAL N° 08/2017', 100);
                        doc.fontSize(13); doc.text('COMPROVANTE DE INSCRIÇÃO', 200).moveDown(1);            
                        //DADOS PESSOAIS                
                        doc.fontSize(13); doc.text('DADOS PESSOAIS', 15).moveDown(1);    
                        doc.lineCap('round').moveTo(15, 150).lineTo(605, 150).stroke();
                        doc.fontSize(10); 
                        doc.text('NOME DO CANDIDATO: ' + resultcandidato[0].nome, 20).moveDown(0.5); 
                        doc.text('E-MAIL: ' + resultcandidato[0].email, 20).moveDown(0.5);    
                        doc.text('NASCIMENTO: ' + dateFormat(resultcandidato[0].nascimento, "dd/mm/yyyy"), 20).moveDown(0.5);    
                        doc.text('CPF: ' + resultcandidato[0].cpf, 20).moveDown(0.5);     
                        doc.text('IDENTIDADE: ' + resultcandidato[0].identidade, 20).moveDown(0.5);
                        doc.text('ENDEREÇO: ' + resultcandidato[0].logradouro + ' ' + resultcandidato[0].numero + ', ' + resultcandidato[0].bairro + ', ' + resultcandidato[0].municipio + ', ' + resultcandidato[0].estado, 20).moveDown(0.5);
                        doc.text('TELEFONE 1: ' + resultcandidato[0].telefone1, 20).moveDown(0.5);    
                        doc.text('TELEFONE 2: ' + resultcandidato[0].telefone2, 20).moveDown(0.5);    
                        doc.text('POSSUI DEFICIÊNCIA?  ' + resultcandidato[0].deficiente + '.   ' + resultcandidato[0].deficiencia, 20).moveDown(1);      
                        //DADOS INSCRIÇÃO
                        doc.fontSize(13); doc.text('DADOS INSCRIÇÃO', 15).moveDown(1);   
                        doc.lineCap('round').moveTo(15, 340).lineTo(605, 340).stroke();
                        doc.fontSize(10);
                        doc.text('ÁREA PLEITEADA:  ' + resultinscricao[0].descricaoarea, 20).moveDown(0.5); 
                        doc.text('FORMAÇÃO ACADÊMICA:  ' + resultinscricao[0].descricaoformacao, 20).moveDown(0.5); 
                        doc.text('CURSO NA ÁREA - OPÇÃO 1:  ' + resultcursos[0].descricao, 20).moveDown(0.5); 
                        doc.text('CURSO NA ÁREA - OPÇÃO 2:  ' + resultcursos[1].descricao, 20).moveDown(0.5);     
                        doc.text('TEMPO DE SERVIÇO (' + resultinscricao[0].pontosfuncoes + ' pontos)', 20).moveDown(0.5);     
                        doc.fontSize(9);   
                        if (resultfuncoes.length > 0){
                            for (var i = 0; i < resultfuncoes.length; i++) {
                                doc.text(  '- DESCRIÇÃO DA FUNÇÃO:  ' + resultfuncoes[i].descricao, 40);
                                doc.text(  '  DATA INICIAL:   '       + dateFormat(resultfuncoes[i].datainicial, "dd/mm/yyyy") + 
                                '      -      DATA FINAL:   '         + dateFormat(resultfuncoes[i].datafinal, "dd/mm/yyyy") +
                                '      -      TOTAL DE DIAS:   '      + resultfuncoes[i].totaldias, 40).moveDown(0.5);
                            };
                        };
                        doc.fontSize(10);
                        doc.text('PONTUAÇÃO TOTAL:  ' + resultinscricao[0].total +
                        '      -      DATA/HORA:  ' + dateFormat(resultinscricao[0].datainscricao, "dd/mm/yyyy - HH:MM") +
                        '      -      PROTOCOLO:  ' + resultinscricao[0].protocolo, 20); 
                        doc.end();
                        res.contentType("application/pdf");
                        doc.pipe(res); 
                    });
                });
            });
        });
    });
};