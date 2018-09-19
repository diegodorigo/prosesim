var mysql = require('mysql');

var connMySQL = function(){
	return connection = mysql.createConnection({
		/*host : 'db4free.net',
		user : 'diego_teste',
		password : 'Diego123',
		database : 'prosesim'
*/
		host : 'localhost',
		user : 'root',
		password : '1234',
		database : 'prosesim'
	});
};

module.exports = function (){
	return connMySQL;
};