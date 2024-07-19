function defineStructure() {
    addColumn("VT_FORNECEDOR");
    addColumn("VT_FILIAL");
    addColumn("VT_NUM");
    addColumn("VT_VALOR", DatasetFieldType.NUMBER);
    addColumn("VT_VENCTOREAL");
    addColumn("VT_QTD");
    addColumn("VT_NOMEFORNE");
    addColumn("VT_VERITIT");
    addColumn("VT_VENCTOREALI"); 


    setKey([ "VT_FORNECEDOR", "VT_NUM",  "VT_FILIAL"]);
    addIndex([ "VT_FORNECEDOR" ]);
    addIndex([ "VT_FILIAL", "VT_FORNECEDOR"]);
    addIndex([ "VT_FORNECEDOR", "VT_NUM"]);
}
function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset(); 
    var dataset2 = DatasetFactory.getDataset("dsVerificatitulo", null, null, null); // busca o dataset completo
    if(dataset2 != null && dataset2.rowsCount > 0){ //se o dataset tem registros 
      for (i = 0; i < dataset2.rowsCount; i++){ // para cada linha retornada no seu dataset .
        dataset.deleteRow([
            dataset2.getValue(i, 'VT_FORNECEDOR'),
            dataset2.getValue(i, 'VT_FILIAL'), 
            dataset2.getValue(i, 'VT_NUM'), 
            dataset2.getValue(i, 'VT_VALOR'), 
            dataset2.getValue(i, 'VT_VENCTOREAL'), 
            dataset2.getValue(i, 'VT_QTD'),  
            dataset2.getValue(i, 'VT_NOMEFORNE'),
            dataset2.getValue(i, 'VT_VERITIT'),
            dataset2.getValue(i, 'VT_VENCTOREALI')]); 
      }
    }   
    var dsContrato = DatasetFactory.getDataset("dsContrato", null, null, null);
    var clientService,data,vo,forn,i,j; 
	for (i = 0; i < dsContrato.rowsCount; i++) { 
        var codforn = dsContrato.getValue(i, 'codigoForn');
        if (codforn != '' || codforn != null || !codforn.isEmpty() || codforn != 'null'){
            try{
                clientService = fluigAPI.getAuthorizeClientService();
                data = {
                    companyId: getValue("WKCompany") + '',
                    serviceCode: 'Protheus',
                    endpoint: '/WSFORN/VERITIT?codforn='+codforn,
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
                if (vo.getResult() == null || vo.getResult().isEmpty()) {
                    log.info("Retorno está vazio");         
                }else{
                    if( vo.getResult() != '{"TitForn":[]}' ){
                        log.info('MEULOG INFO =>' + vo.getResult());
                        forn = JSON.parse(vo.getResult());                    
	                    log.info('MEULOG INFO 2 =>' + forn.TitForn[0].Filial);
                        log.info('MEULOG INFO 3 =>' + forn.TitForn.length);
	                    for(j = 0; j < forn.TitForn.length; j++){
	                    	log.info('MEULOG INFO J =>' + j);
	                        dataset.addOrUpdateRow([
                                forn.TitForn[j].CodForn,
                                forn.TitForn[j].Filial,
                                forn.TitForn[j].Num,
                                forn.TitForn[j].Valor,
                                forn.TitForn[j].VencReal,
                                forn.TitForn[j].Qtd,
                                forn.TitForn[j].Fornecedor,
                                forn.TitForn[j].VeriVenc,
                                forn.TitForn[j].VencRealI
                            ])
	                    }
                    }                    
                }
            }catch(e){
                log.info("MeuLog info "+ e)    
            }
        }
    }
    return dataset
}
function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset(); 
    dataset.addColumn("VT_FORNECEDOR"); 
    dataset.addColumn("VT_FILIAL"); 
    dataset.addColumn("VT_NUM"); 
    dataset.addColumn("VT_VALOR", DatasetFieldType.NUMBER); 
    dataset.addColumn("VT_VENCTOREAL"); 
    dataset.addColumn("VT_QTD"); 
    dataset.addColumn("VT_NOMEFORNE"); 
    dataset.addColumn("VT_VERITIT");
    dataset.addColumn("VT_VENCTOREALI");    
    var clientService,data,vo,forn,i,j,x=""; 

    var dsContrato = DatasetFactory.getDataset("dsContrato", null, null, ['codigoForn']);
    for (i = 0; i < dsContrato.rowsCount; i++) { 
        var codforn = dsContrato.getValue(i, 'codigoForn');
        if( x != codforn){
            x = codforn
            if (codforn != '' || codforn != null || !codforn.isEmpty() || codforn != 'null' || codforn.alltrim().length == 0){
                try{
                    clientService = fluigAPI.getAuthorizeClientService();
                    data = {
                        companyId: getValue("WKCompany") + '',
                        serviceCode: 'Protheus',
                        endpoint: '/WSFORN/VERITIT?codforn='+codforn,
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
                    if (vo.getResult() == null || vo.getResult().isEmpty()) {
                        log.info("Retorno está vazio");         
                    }else{
                        if( vo.getResult() != '{"TitForn":[]}' ){
                            log.info('MEULOG INFO =>' + vo.getResult());
                            forn = JSON.parse(vo.getResult());                    
                            log.info('MEULOG INFO 2 =>' + forn.TitForn[0].Filial);
                            log.info('MEULOG INFO 3 =>' + forn.TitForn.length);
                            
                            for(j = 0; j < forn.TitForn.length; j++){
                                dataset.addRow([
                                    forn.TitForn[j].CodForn,
                                    forn.TitForn[j].Filial,
                                    forn.TitForn[j].Num,
                                    forn.TitForn[j].Valor,
                                    forn.TitForn[j].VencReal,
                                    forn.TitForn[j].Qtd,
                                    forn.TitForn[j].Fornecedor,
                                    forn.TitForn[j].VeriVenc,
                                    forn.TitForn[j].VencRealI
                                ])
                            }
                        }                    
                    }
                }catch(e){
                        
                }
            }
        }
    }
    

    
    return dataset
}

function onMobileSync(user) {

}