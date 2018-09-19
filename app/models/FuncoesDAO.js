function FuncoesDAO(connection){
	this._connection = connection;
};

FuncoesDAO.prototype.getFuncoesInscricao = function(codigoinscricao, callback){
	this._connection.query('select * from tabfuncoes where codigoinscricao ='+ codigoinscricao, callback);
};

FuncoesDAO.prototype.getUltimaData = function(codigoinscricao, callback){
	this._connection.query('select max(datafinal) as ultimadata from tabfuncoes where codigoinscricao ='+ codigoinscricao, callback);
};

FuncoesDAO.prototype.salvarFuncao = function(codigoinscricao, newdescricao, newdatainicial, newdatafinal, newtotaldias, callback){
	this._connection.query('insert into tabfuncoes(codigoinscricao, descricao, datainicial, datafinal, totaldias) ' +
						   'values('+ codigoinscricao +', "'+ newdescricao +'", "'+ newdatainicial +'", "'+ newdatafinal +'", '+ newtotaldias +')', callback);						   
};

module.exports = function(){
	return FuncoesDAO;
};