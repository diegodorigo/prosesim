module.exports = function(application){
	application.get('/', function(req, res){
		application.app.controllers.home.index(application, req, res);
	});

	application.post('/', function(req, res){
		application.app.controllers.home.acessaCandidato(application, req, res);
	});
};