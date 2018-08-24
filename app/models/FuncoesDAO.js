function FuncoesDAO(connection){
	this._connection = connection;
};

FuncoesDAO.prototype.getFuncoesInscricao = function(codigoinscricao, callback){
	this._connection.query('select * from tabfuncoes where codigoinscricao ='+ codigoinscricao, callback);
};

module.exports = function(){
	return FuncoesDAO;
};