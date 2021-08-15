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

router.get('/alimento', modules.authenticated, async (req, res) => {
    const id = req.query.id;
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${id}'`);
    const listaCapacidades = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${id}'`);
    const novaListaCapacidades = modules.capacidades(listaCapacidades[0]);

    if(produto[0][0].validade === 1) {
        res.render('alimento.ejs', {
            id: produto[0][0].id,
            alimento: produto[0][0].produto,
            imagem: produto[0][0].imagem,
            observacoes: produto[0][0].observacoes,
            capacidades: novaListaCapacidades,
            validade: "on",
            message: "on"
        });
    } else {
        res.render('alimento.ejs', {
            id: produto[0][0].id,
            alimento: produto[0][0].produto,
            imagem: produto[0][0].imagem,
            observacoes: produto[0][0].observacoes,
            capacidades: novaListaCapacidades,
            validade: "off",
            message: "on"
        });
    }
    
});

router.post('/alimento', modules.authenticated, async (req, res) => {
    const id = req.body.id;
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${id}'`);
    const listaCapacidades = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${id}'`);
    const novaListaCapacidades = modules.capacidades(listaCapacidades[0]);

    if(produto[0][0].validade === 1) {
        res.render('alimento.ejs', {
            id: produto[0][0].id,
            alimento: produto[0][0].produto,
            imagem: produto[0][0].imagem,
            observacoes: produto[0][0].observacoes,
            capacidades: novaListaCapacidades,
            validade: "on"
        });
    } else {
        res.render('alimento.ejs', {
            id: produto[0][0].id,
            alimento: produto[0][0].produto,
            imagem: produto[0][0].imagem,
            observacoes: produto[0][0].observacoes,
            capacidades: novaListaCapacidades,
            validade: "off"
        });
    }
});

router.post('/concluir', modules.authenticated, async (req, res) => {
    const body = req.body;
    const validade = body.validade + "-01";
    const alimento = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID = '${body.id}' AND CAPACIDADE= '${body.peso}'`);
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

router.get('/outros', modules.notAuthenticated, (req, res) => {
    res.render('outros.ejs');
});

module.exports = router;