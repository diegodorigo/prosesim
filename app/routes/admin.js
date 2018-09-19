module.exports = function(application){
	application.get('/admin', function(req, res){
		application.app.controllers.admin.login(application, req, res);
	});

	application.post('/acessa_admin', function(req, res){
		application.app.controllers.admin.acessaAdmin(application, req, res);
	});

	application.post('/classificacao', function(req, res){		
		application.app.controllers.admin.classificar(application, req, res);
	});
};