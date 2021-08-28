const db = require('../database');

function construirInventario(lista) {
    var inventario = new Array();

    for (var n of lista) {
        const obj = {
            alimento: n.produto,
            imagem: n.imagem,
            id: n.id
        }
        inventario.push(obj);
    }
    return inventario;
}

function construirListaCapacidades(lista) {
    var capacidades = new Array();

    for (var n of lista) {
        const obj = {
            capacidade: n.capacidade,
            id: n.id
        }
        capacidades.push(obj);
    }
    return capacidades;
}

async function darEntradaProduto(row, nome, produto, alimento_id, validade, peso, quantidade) {
    const split = validade.split("-");
    const formatValidade = split[2] + "-" + split[1] + "-" + split[0];;
    const acao = "Entrada " + quantidade+ " " + produto + " " + peso + " " + formatValidade;

    if (row.length === 0) {
        await db.promise().query(`INSERT INTO validade (alimento_id, data, quantidade) VALUES ('${alimento_id}', '${validade}', '${quantidade}')`);
        await db.promise().query(`INSERT INTO historico (data, nome, acao) VALUES (NOW(), '${nome}', '${acao}')`);
        return
    } else {
        await db.promise().query(`UPDATE VALIDADE SET QUANTIDADE = QUANTIDADE+'${quantidade}' WHERE ALIMENTO_ID = '${alimento_id}' AND DATA = '${validade}'`);
        await db.promise().query(`INSERT INTO historico (data, nome, acao) VALUES (NOW(), '${nome}', '${acao}')`);
        return
    }
}

async function darSaidaProduto(row, nome, produto, alimento_id, validade, peso, quantidade) {
    const split = validade.split("-");
    const formatValidade = split[2] + "-" + split[1] + "-" + split[0];;
    const acao = "Saída " + quantidade+ " " + produto + " " + peso + " " + formatValidade;

    if (row.length === 0) {
        await db.promise().query(`INSERT INTO validade (alimento_id, data, quantidade) VALUES ('${alimento_id}', '${validade}','${- quantidade}')`);
        await db.promise().query(`INSERT INTO historico (data, nome, acao) VALUES (NOW(), '${nome}', '${acao}')`);
        return
    } else {
        await db.promise().query(`UPDATE VALIDADE SET QUANTIDADE = QUANTIDADE-'${quantidade}' WHERE ALIMENTO_ID = '${alimento_id}' AND DATA = '${validade}'`);
        await db.promise().query(`INSERT INTO historico (data, nome, acao) VALUES (NOW(), '${nome}', '${acao}')`);
        return
    }
}

function bodyAlimento(id, alimento, imagem, observacoes, capacidades, validade, message) {
    if (message === true) {
        if (validade === 1) {
            return {
                id: id,
                alimento: alimento,
                imagem: imagem,
                observacoes: observacoes,
                capacidades: capacidades,
                validade: "on",
                message: "on"
            };
        } else {
            return {
                id: id,
                alimento: alimento,
                imagem: imagem,
                observacoes: observacoes,
                capacidades: capacidades,
                validade: "off",
                message: "on"
            };
        }
    } else {
        if (validade === 1) {
            return {
                id: id,
                alimento: alimento,
                imagem: imagem,
                observacoes: observacoes,
                capacidades: capacidades,
                validade: "on",
            };
        } else {
            return {
                id: id,
                alimento: alimento,
                imagem: imagem,
                observacoes: observacoes,
                capacidades: capacidades,
                validade: "off",
            };
        }
    }

};

function formatValidade(validade) {
    return 
}

exports.construirInventario = construirInventario;
exports.construirListaCapacidades = construirListaCapacidades;
exports.darEntradaProduto = darEntradaProduto;
exports.darSaidaProduto = darSaidaProduto;
<<<<<<< HEAD
exports.formatValidade = formatValidade;
exports.bodyAlimento = bodyAlimento;
=======
exports.bodyAlimento = bodyAlimento;
>>>>>>> 0bf12ff5ab936d577ee4474012756e6ca8081b20
