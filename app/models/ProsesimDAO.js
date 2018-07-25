function ProsesimDAO(connection){
	this._connection = connection;
};

ProsesimDAO.prototype.getCandidatos = function(callback){
	this._connection.query('select * from tabcandidatos', callback);
};

ProsesimDAO.prototype.getCandidato = function(callback){
	this._connection.query('select * from tabcandidatos where codigocandidato = 1', callback);
};

ProsesimDAO.prototype.checkCpf = function(cpf, callback){
	this._connection.query('select codigocandidato from tabcandidatos where cpf = ' + cpf, callback);
}

module.exports = function(){
	return ProsesimDAO;
};