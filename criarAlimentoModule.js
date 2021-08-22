const db = require('./database');

async function inserirNoInventario(nome, imagem, observacoes, validade) {
    // O que fazer caso já exista?
    if (validade === "on") {
        await db.promise().query(`INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('${nome}', '${imagem}', '${observacoes}', '${1}', '${1}')`);
    } else {
        await db.promise().query(`INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('${nome}', '${imagem}', '${observacoes}', '${0}', '${1}')`);
    }
    return
}

async function inserirCapacidade(nome, capacidade) {
    const row = await db.promise().query(`SELECT id FROM inventario WHERE produto = '${nome}'`);
    await db.promise().query(`INSERT INTO alimento (inventario_id, capacidade) VALUES ('${row[0][0].id}','${capacidade}')`);
    return
}

exports.inserirNoInventario = inserirNoInventario;
exports.inserirCapacidade = inserirCapacidade;