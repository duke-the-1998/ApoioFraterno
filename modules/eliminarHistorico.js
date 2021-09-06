async function eliminarHistorico (id) {
    const db = require('../database');
    return db.promise().query(`DELETE INTO historico WHERE id = '${id}'`);
}

async function eliminarHistoricoTodo (id) {
    
}