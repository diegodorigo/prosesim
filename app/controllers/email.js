module.exports.acessaVerificacao = function(application, req, res) {
    res.render("candidatos/email", {validacao : {}, informacao : {}, dadosForm : req.body});
};

module.exports.enviaVerificador = function(application, req, res) {   
    var dadosForm = req.body;
    
    req.assert('email', 'Email inválido!').isEmail();    
    var erros = req.validationErrors();    
    
    if (erros){
        res.render("candidatos/email", {validacao : erros, informacao : {}, dadosForm : {}});
        return;
    };      
    
    var randomstring = require('randomstring');
    dadosForm.codVerificador = randomstring.generate();    
    var mailConnection = application.config.mailConnection;				
    var mailOptions = {
        from: 'SEMED Guarapari/ES',
        to: dadosForm.email,
        subject: 'Verificação de email - Processo Seletivo Simplificado',
        html: '<html>'+
                '<head>'+
                    '<style>p, h2, h3 {font-family: Arial, Helvetica, sans-serif;}</style>'+
                '</head> '+
                '<body> '+
                    '<h2>PREFEITURA MUNICIPAL DE GUARAPARI</h2> '+
                    '<h3>SECRETARIA MUNICIPAL DE EDUCAÇÃO</h3>	'+
                    '<h3>Processo Seletivo Simplificado - Edital nº 008/2018</h3> '+
                    '<br/> <p>Olá!</p> <br/>'+
                    '<p>Código verificador: <b>'+dadosForm.codVerificador+'</b></p> '+
                    '<br/>'+
                    '<p><b>O que fazer com o código acima?</b></p>'+
                    '<p>1. Selecione e copie <b>(Ctrl C)</b>;</p>'+
                    '<p>2. Retorne para a página de <b>Verificação de E-mail</b>;</p>'+
                    '<p>3. Cole <b>(Ctrl V)</b> o código no campo <b>PASSO 2 - Código verificador</b>;</p>'+
                    '<p>4. Clique no botão <b>Verificar</b>.</p>'+
                    '<p>5. Se a verificação falhar, repita o processo clicando novamente no botão <b>Enviar</b>.</p>'+
                    '<br/>'+
                    '<p style="font-size:12px;">Este é um e-mail automático, não é necessário respondê-lo.</p> '+
                    '<br/>'+
                    '<p>Atenciosamente,</p> '+
                    '<p>Comissão Organizadora do Processo Seletivo</p>'+
                '</body>'+
            '</html>'
    };

    mailConnection.sendMail(mailOptions, function(error, info){
        if (error) {
            erros = [{location: 'body', param: 'email', msg: 'Email não enviado!', value: dadosForm.email}];;
            res.render("candidatos/email", {validacao : erros, informacao : {}, dadosForm : {}});
            return;
        } else {
            info = [{location: 'body', param: 'email', msg: 'Código de verificação enviado para o e-mail "'+dadosForm.email+'".' , value: dadosForm.email}];
        }
        res.render("candidatos/email", {validacao : {}, informacao : info, dadosForm : dadosForm});
    });
};