function CandidatosDAO(connection){
	this._connection = connection;
};

CandidatosDAO.prototype.checkUser = function(cpf, callback){
	this._connection.query('select senha from tabcandidatos where cpf = "'+cpf+'"', callback);
};

CandidatosDAO.prototype.getCandidato = function(cpf, callback){
	this._connection.query('select * from tabcandidatos where cpf = "'+cpf+'"', callback);
};

CandidatosDAO.prototype.salvarCandidato = function(candidato, callback){
	this._connection.query('insert into tabcandidatos set ?', candidato, callback);
};

CandidatosDAO.prototype.getInscricoesCandidato = function(codigocandidato, callback){
	this._connection.query('select tabinscricoes.codigoinscricao, tabinscricoes.codigocandidato, ' +
		'tabinscricoes.opcao, tabinscricoes.codigoarea, tabinscricoes.datainscricao, ' +
		'tabinscricoes.protocolo, tabareas.descricao as descricaoarea, ' +
		'tabinscricoes.codigoformacao, tabformacoes.descricao as descricaoformacao, ' +
		'tabformacoes.pontos as pontosformacao from tabinscricoes ' +
		'left join tabareas on tabinscricoes.codigoarea = tabareas.codigoarea ' +
		'left join tabformacoes on tabinscricoes.codigoformacao = tabformacoes.codigoformacao ' +
		'where tabinscricoes.codigocandidato ='+ codigocandidato, callback
	);
};

CandidatosDAO.prototype.salvarInscricao = function(dadosForm, protocolo, callback){
	this._connection.query('insert into tabinscricoes(codigocandidato, opcao, codigoformacao, codigoarea, protocolo) ' +
						   'values('+ dadosForm.codigocandidato +', '+ dadosForm.opcao +', '+ dadosForm.codigoformacao +', '+ dadosForm.codigoarea +', '+ protocolo +')', callback);
};

module.exports = function(){
	return CandidatosDAO;
};