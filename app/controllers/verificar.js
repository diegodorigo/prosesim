module.exports.acessaCadastro = function(application, req, res) {   
    var dadosForm = req.body;
    
    req.assert('email', 'Antes de realizar a verificação, insira um email no campo "E-mail do candidato" e clique no botão Enviar!').notEmpty();    
    var erros = req.validationErrors();    
    if (erros){
        res.render("candidatos/email", {validacao : erros, informacao : {}, dadosForm : {}});
        return;
    }; 
    
    req.assert('verificador', 'Insira o código verificador enviado para o e-mail informado acima!').notEmpty();    
    var erros = req.validationErrors();    
    if (erros){
        res.render("candidatos/email", {validacao : erros, informacao : {}, dadosForm : dadosForm});
        return;
    };   
    
    if (dadosForm.codVerificador != dadosForm.verificador){
        erros = [{location: 'body', param: 'verificador', msg: 'Código inválido!', value: dadosForm.verificador}];
        res.render("candidatos/email", {validacao : erros, informacao : {}, dadosForm : dadosForm});
        return;  
    } else {
        res.render("candidatos/cadastro", {validacao : erros, dadosForm : dadosForm});     
    };    
};