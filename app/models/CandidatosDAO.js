function CandidatosDAO(connection){
	this._connection = connection;
};

CandidatosDAO.prototype.checkUser = function(cpf, callback){
	this._connection.query('select codigocandidato, senha from tabcandidatos where cpf = "'+cpf+'"', callback);
};

CandidatosDAO.prototype.getCandidato = function(cpf, codigo, callback){	
	this._connection.query('select * from tabcandidatos where cpf = "'+cpf+'" or codigocandidato = '+codigo, callback);
};

CandidatosDAO.prototype.incluirCandidato = function(candidato, callback){
	this._connection.query('insert into tabcandidatos set ?', candidato, callback);
};

CandidatosDAO.prototype.alterarCandidato = function(candidato, callback){
	this._connection.query('update tabcandidatos set nome = "'+ candidato.nome +'", '+
						   ' email = "'+ candidato.email +'", '+	
						   ' nascimento = "'+ candidato.nascimento +'", '+
						   ' identidade = "'+ candidato.identidade +'", '+
						   ' logradouro = "'+ candidato.logradouro +'", '+
						   ' numero = "'+ candidato.numero +'", '+
						   ' bairro = "'+ candidato.bairro +'", '+
						   ' municipio = "'+ candidato.municipio +'", '+
						   ' estado = "'+ candidato.estado +'", '+
						   ' telefone1 = "'+ candidato.telefone1 +'", '+
						   ' telefone2 = "'+ candidato.telefone2 +'", '+
						   ' deficiente = "'+ candidato.deficiente +'", '+
						   ' deficiencia = "'+ candidato.deficiencia +'", '+
						   ' senha = "'+ candidato.senha +'" '+	
						   ' where codigocandidato = ' + candidato.codigocandidato, candidato, callback);
};

CandidatosDAO.prototype.getInscricoesCandidato = function(codigocandidato, callback){
	this._connection.query('select tabinscricoes.codigocandidato, ' +
							'tabinscricoes.codigoinscricao, ' +
							'tabinscricoes.opcao,	 ' +
							'tabinscricoes.datainscricao,  ' +
							'tabinscricoes.protocolo, ' +
							'tabinscricoes.codigoarea,  ' +
							'tabinscricoes.concluida,  ' +
							'tabareas.descricao as descricaoarea,  ' +
							'tabformacoes.descricao as descricaoformacao,  ' +
							'tabformacoes.pontos as pontosformacao, ' +
							'sum(tabcursos.pontos) as pontoscursos,	 ' +
							'if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes ' +
							'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) ' +
							'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as pontosfuncoes, ' +
							'tabformacoes.pontos + sum(tabcursos.pontos) + if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes ' +
							'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) ' +
							'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as total ' +
							'from tabinscricoes ' +
							'join tabareas on tabinscricoes.codigoarea = tabareas.codigoarea ' +
							'join tabformacoes on tabinscricoes.codigoformacao = tabformacoes.codigoformacao ' +
							'left join tabcursosinscricao on tabinscricoes.codigoinscricao = tabcursosinscricao.codigoinscricao ' +
							'left join tabcursos on tabcursosinscricao.codigocurso = tabcursos.codigocurso ' +
							'where tabinscricoes.codigocandidato = '+ codigocandidato +' group by tabinscricoes.codigoinscricao', callback);							
};

CandidatosDAO.prototype.getInscricaoCandidato = function(codigoinscricao, callback){
	this._connection.query('select tabinscricoes.codigocandidato, ' +
							'tabinscricoes.codigoinscricao, ' +
							'tabinscricoes.opcao,	 ' +
							'tabinscricoes.datainscricao,  ' +
							'tabinscricoes.protocolo, ' +
							'tabinscricoes.codigoarea,  ' +
							'tabinscricoes.concluida,  ' +
							'tabareas.descricao as descricaoarea,  ' +
							'tabformacoes.descricao as descricaoformacao,  ' +
							'tabformacoes.pontos as pontosformacao, ' +
							'sum(tabcursos.pontos) as pontoscursos,	 ' +
							'if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes ' +
							'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) ' +
							'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as pontosfuncoes, ' +
							'tabformacoes.pontos + sum(tabcursos.pontos) + if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes ' +
							'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) ' +
							'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as total ' +
							'from tabinscricoes ' +
							'join tabareas on tabinscricoes.codigoarea = tabareas.codigoarea ' +
							'join tabformacoes on tabinscricoes.codigoformacao = tabformacoes.codigoformacao ' +
							'left join tabcursosinscricao on tabinscricoes.codigoinscricao = tabcursosinscricao.codigoinscricao ' +
							'left join tabcursos on tabcursosinscricao.codigocurso = tabcursos.codigocurso ' +
							'where tabinscricoes.codigoinscricao = '+ codigoinscricao, callback);							
};

CandidatosDAO.prototype.insereInscricao = function(inscricao, callback){
	this._connection.query('insert into tabinscricoes(codigocandidato, opcao, codigoformacao, codigoarea, protocolo, concluida) ' +
						   'values('+ inscricao.codigocandidato +', '+ inscricao.opcao +', '+ inscricao.codigoformacao +', '+ inscricao.codigoarea +', '+ inscricao.protocolo +', '+ 0 +')', callback);
};

CandidatosDAO.prototype.alteraInscricao = function(inscricao, callback){
	this._connection.query('update tabinscricoes set '+ 
						   'codigoformacao = '+ inscricao.codigoformacao +', '+
						   'codigoarea = '+ inscricao.codigoarea +', ' +
						   'protocolo = '+ inscricao.protocolo +', ' +
						   'concluida = ' + 1 +' where '+ 
						   'codigocandidato = '+ inscricao.codigocandidato +' and '+
						   'codigoinscricao = '+ inscricao.codigoinscricao, callback);
};

CandidatosDAO.prototype.verificaInscricaoRepetida = function(codigocandidato, codigoarea, callback){
	this._connection.query('select codigoinscricao from tabinscricoes where codigocandidato = '+ codigocandidato +' and codigoarea = '+ codigoarea, callback);
};

CandidatosDAO.prototype.verificaInscricaoConcluida = function(codigoinscricao, callback){
	this._connection.query('select concluida from tabinscricoes where codigoinscricao = '+ codigoinscricao, callback);
};

module.exports = function(){
	return CandidatosDAO;
};