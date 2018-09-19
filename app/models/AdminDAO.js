function AdminDAO(connection){
	this._connection = connection;
};

AdminDAO.prototype.checkUser = function(cpf, callback){
	this._connection.query('select senha from tabusuarios where cpf = "'+cpf+'"', callback);
};

AdminDAO.prototype.getInscricoes = function(codigoarea, callback){	
	if(codigoarea != 0) {		
		query = 'select tabinscricoes.codigocandidato, tabcandidatos.nome, tabcandidatos.email, tabcandidatos.nascimento, '+
				'tabcandidatos.cpf, tabcandidatos.identidade, tabcandidatos.logradouro , tabcandidatos.numero, ' +
				'tabcandidatos.bairro, tabcandidatos.municipio, tabcandidatos.estado, '+
				'tabcandidatos.telefone1, tabcandidatos.telefone2, tabcandidatos.deficiente, tabcandidatos.deficiencia, '+ 
				'tabinscricoes.codigoinscricao, tabinscricoes.opcao, tabinscricoes.datainscricao,  tabinscricoes.protocolo, '+
				'tabinscricoes.codigoarea, tabareas.descricao as descricaoarea,  tabformacoes.descricao as descricaoformacao,  '+
				'tabformacoes.pontos as pontosformacao, sum(tabcursos.pontos) as pontoscursos,	 '+
				'if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes '+
				'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) '+
				'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as pontosfuncoes, '+
				'tabformacoes.pontos + sum(tabcursos.pontos) + if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes '+
				'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) '+
				'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as total from tabinscricoes '+
				'join tabcandidatos on tabinscricoes.codigocandidato = tabcandidatos.codigocandidato '+
				'join tabareas on tabinscricoes.codigoarea = tabareas.codigoarea '+
				'join tabformacoes on tabinscricoes.codigoformacao = tabformacoes.codigoformacao '+
				'join tabcursosinscricao on tabinscricoes.codigoinscricao = tabcursosinscricao.codigoinscricao '+
				'join tabcursos on tabcursosinscricao.codigocurso = tabcursos.codigocurso '+
				'where tabareas.codigoarea = '+ codigoarea +' group by tabinscricoes.codigoinscricao order by 26 desc, 23 desc, 25 desc, 4 asc';
	} else {		
		query = 'select tabinscricoes.codigocandidato, tabcandidatos.nome, tabcandidatos.email, tabcandidatos.nascimento, '+
				'tabcandidatos.cpf, tabcandidatos.identidade, tabcandidatos.logradouro , tabcandidatos.numero, ' +
				'tabcandidatos.bairro, tabcandidatos.municipio, tabcandidatos.estado, '+
				'tabcandidatos.telefone1, tabcandidatos.telefone2, tabcandidatos.deficiente, tabcandidatos.deficiencia, '+
				'tabinscricoes.codigoinscricao, tabinscricoes.opcao, tabinscricoes.datainscricao,  tabinscricoes.protocolo, '+
				'tabinscricoes.codigoarea, tabareas.descricao as descricaoarea,  tabformacoes.descricao as descricaoformacao,  '+
				'tabformacoes.pontos as pontosformacao, sum(tabcursos.pontos) as pontoscursos,	 '+
				'if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes '+
				'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) '+
				'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as pontosfuncoes, '+
				'tabformacoes.pontos + sum(tabcursos.pontos) + if ((select coalesce(sum(tabfuncoes.totaldias),0) from tabfuncoes '+
				'where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01>10, 10, (select coalesce(sum(tabfuncoes.totaldias),0) '+
				'from tabfuncoes where tabfuncoes.codigoinscricao = tabinscricoes.codigoinscricao) * 0.01) as total from tabinscricoes '+
				'join tabcandidatos on tabinscricoes.codigocandidato = tabcandidatos.codigocandidato '+
				'join tabareas on tabinscricoes.codigoarea = tabareas.codigoarea '+
				'join tabformacoes on tabinscricoes.codigoformacao = tabformacoes.codigoformacao '+
				'join tabcursosinscricao on tabinscricoes.codigoinscricao = tabcursosinscricao.codigoinscricao '+
				'join tabcursos on tabcursosinscricao.codigocurso = tabcursos.codigocurso '+
				'where tabinscricoes.codigoarea <> 0 group by tabinscricoes.codigoinscricao order by 26 desc, 23 desc, 25 desc, 4 asc';
	};
	this._connection.query(query, callback);
};

module.exports = function(){
	return AdminDAO;
};