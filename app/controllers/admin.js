module.exports.login = function(application, req, res){
    res.render("admin/login", {validacao:{}, dadosForm: {}}); 
};

module.exports.acessaAdmin = function(application, req, res){
	var connection = application.config.dbConnection();
	var AdminModel = new application.app.models.AdminDAO(connection);
	var AreasModel     = new application.app.models.AreasDAO(connection);
	var dadosForm  = req.body;
	var erros      = [];	
	var dateFormat = require('dateformat');
    
    AdminModel.checkUser(dadosForm.cpf, function(error, result){
		if (dadosForm.cpf == ''){
			erros = [{location: 'body', param: 'cpf', msg: 'Informe o CPF e senha para acessar!', value: dadosForm.cpf}];
		} else {
			if (result == ''){
				erros = [{location: 'body', param: 'cpf', msg: 'CPF não cadastrado!', value: dadosForm.cpf}];
			} else{
				if (dadosForm.senha != result[0].senha){
					erros = [{location: 'body', param: 'senha', msg: 'Senha inválida!', value: dadosForm.senha}];
				};
			};	
		};		

		if (erros.length > 0){
			res.render("admin/login", {validacao : erros, dadosForm: dadosForm});
			return;
		};
		AreasModel.listarAreas(function(error, resultareas){
			AdminModel.getInscricoes(0, function(error, result){
				for (var i = 0; i < result.length; i++) {
					result[i].nascimento = dateFormat(result[i].nascimento, "dd/mm/yyyy");
					result[i].datainscricao = dateFormat(result[i].datainscricao, "dd/mm/yyyy - HH:MM");
				};
				res.render("admin/admin", {validacao:{}, areas: resultareas, inscricoes: result});
			}); 
		});       
    });	
};

module.exports.classificar = function(application, req, res){
	var connection = application.config.dbConnection();
	var AdminModel = new application.app.models.AdminDAO(connection);
	var AreasModel = new application.app.models.AreasDAO(connection);
	var dadosForm  = req.body;
	var dateFormat = require('dateformat');
	
	AreasModel.listarAreas(function(error, resultareas){
		AdminModel.getInscricoes(dadosForm.codigoarea, function(error, result){				
			for (var i = 0; i < result.length; i++) {
				result[i].nascimento = dateFormat(result[i].nascimento, "dd/mm/yyyy");
				result[i].datainscricao = dateFormat(result[i].datainscricao, "dd/mm/yyyy - HH:MM");
			};
			res.render("admin/admin", {validacao: {}, areas: resultareas, inscricoes: result});
		}); 
	}); 	
};
