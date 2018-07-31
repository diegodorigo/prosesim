function ProsesimDAO(connection){
	this._connection = connection;
};
/*
ProsesimDAO.prototype.getCandidatos = function(callback){
	this._connection.query('select * from tabcandidatos', callback);
};*/

ProsesimDAO.prototype.getCandidato = function(cpf, callback){
	this._connection.query('select * from tabcandidatos where cpf = "'+cpf+'"', callback);
};

/*
ProsesimDAO.prototype.checkCpf = function(cpf, callback){
	this._connection.query('select codigocandidato from tabcandidatos where cpf = ' + cpf, callback);
}*/

ProsesimDAO.prototype.salvarCandidato = function(candidato, callback){
	this._connection.query('insert into tabcandidatos set ?', candidato, callback);
}

module.exports = function(){
	return ProsesimDAO;
};