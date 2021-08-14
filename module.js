const db = require('./database');

module.exports = {
    authenticated: function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    notAuthenticated: function checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/voluntarios/menuPrincipal');
        }
        next();
    },
    inventario: function construirInventario(lista) {
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
    },
    pesos: function construirListaPesos(lista) {
        var pesos = new Array();
    
        for (var n of lista) {
            const obj = {
                peso: n.peso_produto,
                id: n.id
            }
            pesos.push(obj);
        }
        return pesos;
    },
    adicionar: async function darEntradaProduto(row, alimento_id, validade, quantidade) {
        if (row.length === 0) {
            db.promise().query(`INSERT INTO validade (alimento_id, data, quantidade) VALUES ('${alimento_id}', '${validade}', '${quantidade}')`)
            return
        } else {
            db.promise().query(`UPDATE VALIDADE SET QUANTIDADE = QUANTIDADE+'${quantidade}' WHERE ALIMENTO_ID = '${alimento_id}' AND DATA = '${validade}'`)
            return
        }
    },
    doar: async function darSaidaProduto(row, alimento_id, validade, quantidade) {
        if (row.length === 0) {
            db.promise().query(`INSERT INTO validade (alimento_id, data, quantidade) VALUES ('${alimento_id}', '${validade}','${- quantidade}')`)
            return
        } else {
            db.promise().query(`UPDATE VALIDADE SET QUANTIDADE = QUANTIDADE-'${quantidade}' WHERE ALIMENTO_ID = '${alimento_id}' AND DATA = '${validade}'`)
            return
        }
    }
};