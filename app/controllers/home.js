module.exports.index = function(application, req, res){
	var connection = application.config.dbConnection();
	var ProsesimModel = new application.app.models.ProsesimDAO(connection);

	ProsesimModel.getCandidatos(function(error, result){
		res.render("home/index", {validacao : {}, candidatos : {}});	
	});	
};