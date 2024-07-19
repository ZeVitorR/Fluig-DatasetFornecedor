function defineStructure() {
    addColumn("EE_FORNECEDOR");
    addColumn("EE_ENV5");
    addColumn("EE_ENV1");
    addColumn("EE_DATA");

    setKey([ "EE_FORNECEDOR","EE_DATA"]);
    addIndex([ "EE_FORNECEDOR","EE_DATA" ]);
    addIndex([ "EE_FORNECEDOR" ]);

}
function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset();
    var x = "!";
    
    var date = new Date()
    date = date.toString()
    log.info("Log do dataset sincronizado")
    var dsVerificatitulo1 = DatasetFactory.getDataset("dsVerificatitulo", null, null, null);
    for (i = 0; i < dsVerificatitulo1.rowsCount; i++) {
        var codForn = dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR')
        var constraints = new Array()
        constraints.push(DatasetFactory.createConstraint("VT_FORNECEDOR", codForn, codForn, ConstraintType.MUST));
        var y = 0;
        var dsVerificatitulo2 = DatasetFactory.getDataset("dsVerificatitulo", null, null, null);
        if(x != dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR')){
            if(dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR') == dsVerificatitulo2.getValue(i, 'VT_FORNECEDOR')){
                var parametros = new java.util.HashMap();
                parametros.put("FORNECEDOR", dsVerificatitulo2.getValue(i, 'VT_NOMEFORNE'));
                var tits = new java.util.ArrayList();
                log.info("LOG dsEnvioEmail quantidade "+dsVerificatitulo2.rowsCount)
                for (j = 0; j < dsVerificatitulo2.rowsCount; j++) {
                    if(dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR') == dsVerificatitulo2.getValue(j, 'VT_FORNECEDOR')){
                        if(dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR') == dsVerificatitulo2.getValue(j, 'VT_FORNECEDOR')){
                            var dadosVenci = ''
                            var tit = new java.util.HashMap();
                            if(parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) == 0){
                                dadosVenci = 'vencerá <b>HOJE</b>'
                                y=1;
                            }else{
                                if(dsVerificatitulo2.getValue(j, 'VT_VERITIT') == 'Venceu'){
                                    dadosVenci = '<span style="color:red;font-weight: 700;"> venceu a '+ parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) + ' dias</span>';
                                }else if(dsVerificatitulo2.getValue(j, 'VT_VERITIT') == 'Irá vencer'){
                                    dadosVenci = 'irá  vencer em '+ parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) + ' dias';
                                    if(parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) == 5 ){
                                        y=1;
                                    }
                                }
                            }
                            tit.put("AVISO", dadosVenci);
                            tit.put("CODFORN", dsVerificatitulo2.getValue(j, 'VT_FORNECEDOR'));
                            tit.put("FILIAL", dsVerificatitulo2.getValue(j, 'VT_FILIAL'));
                            tit.put("TITULO", dsVerificatitulo2.getValue(j, 'VT_NUM'));
                            tit.put("VALOR", dsVerificatitulo2.getValue(j, 'VT_VALOR'));
                            tit.put("VENCIMENTO", dsVerificatitulo2.getValue(j, 'VT_VENCTOREAL'));
                            tits.add(tit)
                        }
                    }
                }
                parametros.put("TITS", tits);
                
                //Este parâmetro é obrigatório e representa o assunto do e-mail
                parametros.put("subject", "Titulo a vencer");
                //Monta lista de destinatários
                var destinatarios = new java.util.ArrayList();
                destinatarios.add("carlos@thcm.com.br");
                destinatarios.add("jose.vitor@thcm.com.br");

                if(y == 1){
                    notifier.notify("admin", "email_aviso", parametros, destinatarios, "text/html");
                    dataset.addOrUpdateRow([
                        dsVerificatitulo2.getValue(i, 'VT_FORNECEDOR'),
                        'sim',
                        'nao',
                        date
                    ])
                }
                
            }
            
        }
        x = dsVerificatitulo2.getValue(i, 'VT_FORNECEDOR')
    }
    return dataset
	
}

function createDataset(fields, constraints, sortFields) {    
    var dataset = DatasetBuilder.newDataset(); 
    var date = new Date()
    date = date.toString()
    dataset.addColumn("EE_FORNECEDOR");
    dataset.addColumn("EE_ENV5");
    dataset.addColumn("EE_ENV1");
    dataset.addColumn("EE_DATA");
    var fields = new Array("VT_FILIAL","VT_NUM","VT_VALOR","VT_VENCTOREAL","VT_QTD","VT_FORNECEDOR","VT_NOMEFORNE","VT_VERITIT","VT_VENCTOREALI");
    var sortingFields = new Array("VT_FORNECEDOR");
    var x = "!";
    var y = 0;
    var dsVerificatitulo1 = DatasetFactory.getDataset("dsVerificatitulo", null, null, null);
    for (i = 0; i < dsVerificatitulo1.rowsCount; i++) {
        var codForn = dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR')
        var constraints = new Array()
        constraints.push(DatasetFactory.createConstraint("VT_FORNECEDOR", codForn, codForn, ConstraintType.MUST));
        var dsVerificatitulo2 = DatasetFactory.getDataset("dsVerificatitulo", fields, null, sortingFields);
        if(x != dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR')){
            if(dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR') == dsVerificatitulo2.getValue(i, 'VT_FORNECEDOR')){
                var parametros = new java.util.HashMap();
                parametros.put("FORNECEDOR", dsVerificatitulo2.getValue(i, 'VT_NOMEFORNE'));
                var tits = new java.util.ArrayList();
                log.info("LOG dsEnvioEmail quantidade "+dsVerificatitulo2.rowsCount)
                for (j = 0; j < dsVerificatitulo2.rowsCount; j++) {
                    if(dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR') == dsVerificatitulo2.getValue(j, 'VT_FORNECEDOR')){
                        if(dsVerificatitulo1.getValue(i, 'VT_FORNECEDOR') == dsVerificatitulo2.getValue(j, 'VT_FORNECEDOR')){
                            var dadosVenci = ''
                            var tit = new java.util.HashMap();
                            if(parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) == 0){
                                dadosVenci = 'vencerá <b>HOJE</b>'
                                y=1;
                            }else{
                                if(dsVerificatitulo2.getValue(j, 'VT_VERITIT') == 'Venceu'){
                                    dadosVenci = '<span style="color:red;font-weight: 700;"> venceu a '+ parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) + ' dias</span>';
                                    y=1;
                                }else if(dsVerificatitulo2.getValue(j, 'VT_VERITIT') == 'Irá vencer'){
                                    dadosVenci = 'irá  vencer em '+ parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) + ' dias';
                                    if(parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) == 5 || parseInt(dsVerificatitulo2.getValue(j, 'VT_QTD')) == 1){
                                        y=1;
                                    }
                                }
                            }
                            tit.put("AVISO", dadosVenci);
                            tit.put("CODFORN", dsVerificatitulo2.getValue(j, 'VT_FORNECEDOR'));
                            tit.put("FILIAL", dsVerificatitulo2.getValue(j, 'VT_FILIAL'));
                            tit.put("TITULO", dsVerificatitulo2.getValue(j, 'VT_NUM'));
                            tit.put("VALOR", dsVerificatitulo2.getValue(j, 'VT_VALOR'));
                            tit.put("VENCIMENTO", dsVerificatitulo2.getValue(j, 'VT_VENCTOREAL'));
                            tits.add(tit)
                        }
                    }
                }
                parametros.put("TITS", tits);                
                //Este parâmetro é obrigatório e representa o assunto do e-mail
                parametros.put("subject", "Titulo a vencer");
                //Monta lista de destinatários
                var destinatarios = new java.util.ArrayList();
                destinatarios.add("jose.vitor@thcm.com.br"); 
                destinatarios.add("carlos@thcm.com.br"); 
                if(y == 1){
                    notifier.notify("admin", "email_aviso", parametros, destinatarios, "text/html");
                    dataset.addRow([
                        dsVerificatitulo2.getValue(i, 'VT_FORNECEDOR'),
                        'sim',
                        'nao',
                        date
                    ])
                }                
            }            
        }
        x = dsVerificatitulo2.getValue(i, 'VT_FORNECEDOR')
    }
    return dataset
}
function onMobileSync(user) {

}