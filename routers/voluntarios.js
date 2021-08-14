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

router.post('/inventario', modules.authenticated, async (req, res) => {
    const body = req.body;
    const validade = body.validade + "-01";
    const alimento = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID = '${body.id}' AND PESO_PRODUTO = '${body.peso}'`);
    const row = await db.promise().query(`SELECT * FROM VALIDADE WHERE ALIMENTO_ID = '${alimento[0][0].id}' AND DATA = '${validade}'`);

    if(body.add) {
        modules.adicionar(row[0], alimento[0][0].id, validade, body.quantidade);
    } else {    
        modules.doar(row[0], alimento[0][0].id, validade, body.quantidade);
    }

    res.redirect(url.format({
        pathname:"/voluntarios/alimento",
        query: {
           "id": body.id,
         }
      }));
});

router.get('/alimento', modules.authenticated, async (req, res) => {
    const id = req.query.id;
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${id}'`);
    const listaPesos = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${id}'`);
    const novaListaPesos = modules.pesos(listaPesos[0]);

    res.render('alimento.ejs', {
        alimento: produto[0][0].produto,
        imagem: produto[0][0].imagem,
        observacoes: produto[0][0].observacoes,
        pesos: novaListaPesos,
        id: produto[0][0].id,
        message: 'on'
    });
    
});

router.post('/alimento', modules.authenticated, async (req, res) => {
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${req.body.id}'`);
    const listaPesos = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${req.body.id}'`);
    const novaListaPesos = modules.pesos(listaPesos[0]);

    res.render('alimento.ejs', {
        alimento: produto[0][0].produto,
        imagem: produto[0][0].imagem,
        observacoes: produto[0][0].observacoes,
        pesos: novaListaPesos,
        id: produto[0][0].id
    });
    
});

router.get('/outros', modules.notAuthenticated, (req, res) => {
    res.render('outros.ejs');
});

module.exports = router;