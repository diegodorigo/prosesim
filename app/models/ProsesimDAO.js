function ProsesimDAO(connection){
	this._connection = connection;
};

ProsesimDAO.prototype.getCandidato = function(cpf, callback){
	this._connection.query('select * from tabcandidatos where cpf = "'+cpf+'"', callback);
};

ProsesimDAO.prototype.checkUser = function(cpf, callback){
	this._connection.query('select senha from tabcandidatos where cpf = "'+cpf+'"', callback);
};

ProsesimDAO.prototype.salvarCandidato = function(candidato, callback){
	this._connection.query('insert into tabcandidatos set ?', candidato, callback);
};

module.exports = function(){
	return ProsesimDAO;
};