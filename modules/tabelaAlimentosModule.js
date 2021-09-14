const db = require('../database');
const fs = require('fs');
var ali = null;

function construirAlimentoInventario(lista) {
    var alimento = new Array();

    for (var n of lista) {
        var obj = {
            id_inven: n.id_inven,
            produto: n.produto,
            capacidade:n.capacidade,
            data:[n.data],
            quantidade:[n.quantidade],
            observacoes:n.observacoes,
            estado:n.estado,
            total:n.quantidade,
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
function construirRangeCapacidades(lista){
    var capacidades = new Array();
    for (var n of lista) {
        var obj = {
            id_inventario: n.id_inventario,
            num_ocurrencias: n.num_ocurrencias,
        }
        capacidades.push(obj);
    }
    return capacidades;
}
/* funcao auxiliar para poder determinar se obj e ali sao o mesmo alimento */
function aux(obj){
    return (obj.produto == ali.produto && obj.capacidade == ali.capacidade);
}

function construirMinMax(lista) {
    return [{
        minimo: lista[0].minimo,
        maximo: lista[0].maximo
    }];
}

async function updateInventario(id,obs,estado,capacidade){

    try {
        if (capacidade != ""){
            await db.promise().query(`INSERT INTO alimento (inventario_id, capacidade) VALUES ('${id}', '${capacidade}')`);
        }
        if (estado == "on"){
            await db.promise().query(`UPDATE inventario SET estado=1 , observacoes='${obs}' WHERE id ='${id}'`);
        } else {
            await db.promise().query(`UPDATE inventario SET estado=0 , observacoes='${obs}' WHERE id ='${id}'`);
        }
    }catch (errors) {
        return errors.code;
    }
}

async function deleteInventario(id){
    try{
        const alimentoId = await db.promise().query(`SELECT id FROM alimento WHERE inventario_id ='${id}' `);
        for (var n of alimentoId[0]) {
            await db.promise().query(`DELETE FROM validade WHERE alimento_id = '${n.id}'`);
        }
        await db.promise().query(`DELETE FROM alimento WHERE inventario_id = '${id}'`);
        await db.promise().query(`DELETE FROM inventario WHERE id = '${id}'`);
    }catch (errors) {
        return errors.code;
    }
}

async function deleteImage(id) {
    const row = await db.promise().query(`SELECT imagem FROM inventario WHERE id ='${id}'`);
    console.log(__dirname);
    const imagePath = './public/images/Alimentos/' + row[0][0].imagem;
    fs.unlink(imagePath, (err) => {
        if (err) {
            throw err;
        }
    });
}

exports.updateInventario = updateInventario;
exports.construirMinMax = construirMinMax;
exports.construirAlimentoInventario = construirAlimentoInventario;
exports.construirRangeCapacidades = construirRangeCapacidades ;
exports.deleteInventario=deleteInventario;
exports.deleteImage = deleteImage;
