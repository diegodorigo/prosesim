function AreasDAO(connection){
	this._connection = connection;
};

AreasDAO.prototype.listarAreas = function(callback){
	this._connection.query('select * from tabareas', callback);	
};

module.exports = function(){
	return AreasDAO;
};