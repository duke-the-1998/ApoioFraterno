const { Router } = require('express');
const url = require('url');
const db = require('../database');
const modules = require('../module');

//const { check, validationResult } = require('express-validator');

const router = Router();

router.use((req, res, next) => {
    next();
});

router.get('/menuPrincipal', modules.authenticated, (req, res) => {
    return res.render('menuPrincipal.ejs');
});

router.get('/inventario', modules.authenticated, async (req, res) => {
    const inventario = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ESTADO = 1 ORDER BY produto`);
    const novoInventario = modules.inventario(inventario[0]);
    res.render('inventario.ejs', { 
        alimentos: novoInventario
    });
});

router.get('/alimento/:id', modules.authenticated, async (req, res) => {
    const id = req.params.id;
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${id}'`);
    const listaCapacidades = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${id}'`);
    const novaListaCapacidades = modules.capacidades(listaCapacidades[0]);

    var body;
    if (Object.keys(req.query).length === 0) {
        body = modules.bodyAlimento(id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, false);
    } else {
        body = modules.bodyAlimento(id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, true);
    }
    res.render('alimento.ejs', body);
});

router.post('/alimento', modules.authenticated, async (req, res) => {
    const body = req.body;
    const validade = body.validade + "-01";
    const alimento = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID = '${body.id}' AND CAPACIDADE= '${body.peso}'`);
    const row = await db.promise().query(`SELECT * FROM VALIDADE WHERE ALIMENTO_ID = '${alimento[0][0].id}' AND DATA = '${validade}'`);

    if(body.add) {
        modules.adicionar(row[0], alimento[0][0].id, validade, body.quantidade);
    } else {    
        modules.doar(row[0], alimento[0][0].id, validade, body.quantidade);
    }

    const link = "/voluntarios/alimento/" + body.id;
    res.redirect(url.format({
        pathname: link,
        query: {
           "message": true
        }
    }));
});

router.get('/outros', modules.authenticated, (req, res) => {
    if (Object.keys(req.query).length !== 0) {
        res.render('outros.ejs', { 
            message: req.query.message
        });
    } else {
        res.render('outros.ejs');
    }
});

router.post('/outros', modules.authenticated, async (req, res) => {
    const body = req.body;
    const produto = body.nome;
    const capacidade = body.capacidade;
    const validade = body.validade + "-01";
    const quantidade = body.quantidade;
    const observacoes = body.observacoes;

    if (body.add) {
        await db.promise().query(`INSERT INTO OUTROS (produto, capacidade, data, quantidade, observacoes)
         VALUES ('${produto}', '${capacidade}', '${validade}', '${quantidade}', '${observacoes}')`);
    } else {
        await db.promise().query(`INSERT INTO OUTROS (produto, capacidade, data, quantidade, observacoes)
         VALUES ('${produto}', '${capacidade}', '${validade}', '${-quantidade}', '${observacoes}')`);
    }

    res.redirect(url.format({
        pathname:"/voluntarios/outros",
        query: {
           "message": "Operação feita com sucesso"
        }
    }));
});

module.exports = router;