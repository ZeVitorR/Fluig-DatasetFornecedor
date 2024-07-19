function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	var ds = DatasetBuilder.newDataset();	
	ds.addColumn("RF_CODFORN");
	ds.addColumn("RF_NOME");
	ds.addColumn("RF_CNPJ");
	ds.addColumn("RF_CEP");
	ds.addColumn("RF_CIDADE");
	ds.addColumn("RF_ESTADO");
	ds.addColumn("RF_ENDEREÇO");
	ds.addColumn("RF_BAIRRO");
	log.info("constraints tamanho"+constraints.length.toString())
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "RF_CNPJ") { 
                var cnpjf = constraints[i].initialValue; 
                log.info('constraints: '+cnpjf)
                try{
                    clientService = fluigAPI.getAuthorizeClientService();
                    data = {
                        companyId: getValue("WKCompany") + '',
                        serviceCode: 'Protheus',
                        endpoint: '/WSFORN/FORNECEDOR?cnpj='+cnpjf,
                        method: 'get',// 'delete', 'patch', 'put', 'get'     
                        timeoutService: '100', // segundos
                        options: {
                            encoding: 'UTF-8',
                            mediaType: 'application/json',
                            useSSL: true
                        },
                        headers: {
                            ContentType: 'application/json;charset=UTF-8'
                        }
                    }
                    vo = clientService.invoke(JSON.stringify(data));
                    log.info('MEULOG INFO consulta =>' + vo.getResult());
                    if (vo.getResult() == null || vo.getResult().isEmpty()) {
                        log.info("Retorno está vazio");         
                    }else{
                        
                        if( vo.getResult() != '{"DadosFornecedor":[]}' ){
                            
                            var forn = JSON.parse(vo.getResult());                    
    	                    log.info('MEULOG INFO 2 =>' + forn.DadosFornecedor[0].CodFornece);
                            log.info('MEULOG INFO 3 =>' + forn.DadosFornecedor.length);
                            
    	                    for(j = 0; j < forn.DadosFornecedor.length; j++){
    	                        ds.addRow([
                                    forn.DadosFornecedor[j].CodFornece,
                                    forn.DadosFornecedor[j].NomeForne,
                                    forn.DadosFornecedor[j].CnpjForne,
                                    forn.DadosFornecedor[j].CepForne,
                                    forn.DadosFornecedor[j].Cidade,
                                    forn.DadosFornecedor[j].Estado,
                                    forn.DadosFornecedor[j].Endereco,
                                    forn.DadosFornecedor[j].Bairro
                                ])
    	                    }
                        }                    
                    }
                }catch(e){
                    info.log("MEULOG INFO E => "+e)    
                }
            }
            else if (constraints[i].fieldName == "RF_NOME") {
                var nome = constraints[i].initialValue; 
                log.info('constraints: '+nome)
                try{
                    clientService = fluigAPI.getAuthorizeClientService();
                    data = {
                        companyId: getValue("WKCompany") + '',
                        serviceCode: 'Protheus',
                        endpoint: '/WSFORN/RAZAO?nome='+nome,
                        method: 'get',// 'delete', 'patch', 'put', 'get'     
                        timeoutService: '100', // segundos
                        options: {
                            encoding: 'UTF-8',
                            mediaType: 'application/json',
                            useSSL: true
                        },
                        headers: {
                            ContentType: 'application/json;charset=UTF-8'
                        }
                    }
                    vo = clientService.invoke(JSON.stringify(data));
                    log.info('MEULOG INFO consulta =>' + vo.getResult());
                    if (vo.getResult() == null || vo.getResult().isEmpty()) {
                        log.info("Retorno está vazio");         
                    }else{
                        
                        if( vo.getResult() != '{"Fornecedor":[]}' ){
                            
                            var forn = JSON.parse(vo.getResult());                    
    	                    log.info('MEULOG INFO 2 =>' + forn.Fornecedor[0].CodFornece);
                            log.info('MEULOG INFO 3 =>' + forn.Fornecedor.length);
                            
    	                    for(j = 0; j < forn.Fornecedor.length; j++){
    	                        ds.addRow([
                                    forn.Fornecedor[j].CodFornece,
                                    forn.Fornecedor[j].NomeForne,
                                    forn.Fornecedor[j].CnpjForne,
                                    forn.Fornecedor[j].CepForne,
                                    forn.Fornecedor[j].Cidade,
                                    forn.Fornecedor[j].Estado,
                                    forn.Fornecedor[j].Endereco,
                                    forn.Fornecedor[j].Bairro
                                ])
    	                    }
                        }                    
                    }
                }catch(e){
                    log.info("MEULOG INFO E => "+e)    
                }
            }
        }
        
    }
	return ds
}function onMobileSync(user) {

}