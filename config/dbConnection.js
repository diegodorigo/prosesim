var mysql = require('mysql');

var connMySQL = function(){
	return connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '1234',
		database : 'prosesim'
	});
};

module.exports = function (){
	return connMySQL;
};