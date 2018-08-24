function CursosDAO(connection){
	this._connection = connection;
};

CursosDAO.prototype.listarCursos = function(callback){
	this._connection.query('select * from tabcursos order by codigocurso desc', callback);
};

CursosDAO.prototype.salvarCurso = function(codigoinscricao, codigocurso, callback){
	this._connection.query('insert into tabcursosinscricao(codigoinscricao, codigocurso) values('+ codigoinscricao +','+ codigocurso +')', callback);
};

CursosDAO.prototype.getCursosInscricao = function(codigoinscricao, callback){
	this._connection.query(
		'select	tabcursosinscricao.codigoinscricao, tabcursosinscricao.codigocurso, ' +
		'tabcursos.descricao, tabcursos.pontos as pontoscursos from tabcursosinscricao ' +
		'join tabcursos on tabcursosinscricao.codigocurso = tabcursos.codigocurso '+
		'where tabcursosinscricao.codigoinscricao = ' + codigoinscricao, callback
	);
};

CursosDAO.prototype.deleteCursosInscricao = function(codigoinscricao, callback){
	this._connection.query('delete from tabcursosinscricao where codigoinscricao = '+ codigoinscricao, callback);
};

module.exports = function(){
	return CursosDAO;
};