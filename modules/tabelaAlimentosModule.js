var ali=null;
function construirAlimentoInventario(lista) {
    var alimento = new Array();

    for (var n of lista) {
        var obj = {
            produto: n.produto,
            capacidade:n.capacidade,
            data:[n.data],
            quantidade:[n.quantidade],
            observacoes:n.observacoes,
            estado:n.estado,
            total:n.quantidade
        }
        ali=obj;
        var temp = alimento.findIndex(aux);
        if(temp > 0){
            alimento[temp].data.push(obj.data[0]);
            alimento[temp].quantidade.push(obj.quantidade[0]);
            alimento[temp].total+=obj.total;

        }else{
        alimento.push(obj);
        }
    }
    return alimento;
}

function aux(obj){
    return (obj.produto == ali.produto && obj.capacidade == ali.capacidade);
}

function construirMinMax(lista) {
    return [{
        minimo: lista[0].minimo,
        maximo: lista[0].maximo
    }];
}
exports.construirMinMax = construirMinMax;
exports.construirAlimentoInventario = construirAlimentoInventario;
