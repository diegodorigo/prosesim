function FormacoesDAO(connection){
	this._connection = connection;
};

FormacoesDAO.prototype.listarFormacoes = function(callback){
	this._connection.query('select * from tabformacoes order by codigoformacao desc', callback);
};

module.exports = function(){
	return FormacoesDAO;
};