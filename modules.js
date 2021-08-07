const db = require('./database');

module.exports = {
    foo: async function getAlimentos() {
        const alimentos = await db.promise().query(`SELECT * FROM ALIMENTO WHERE ESTADO = 1`);
        return alimentos;
    }
}
