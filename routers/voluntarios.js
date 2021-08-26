const { Router } = require('express');
const url = require('url');
const db = require('../database');
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/checkAuthenticated');
const { validateChangePasswordSchema } = require('../middleware/validateRequestSchema');
const { passwordSchema } = require('../schema/changePasswordSchema.js');
const modules = require('../modules/module');
const { mudarPassword } = require('../modules/mudarPasswordModule.js');

//const { check, validationResult } = require('express-validator');

const router = Router();

router.use((req, res, next) => {
    next();
});

router.get('/menuPrincipal', checkAuthenticated, async (req, res) => {
    const user = req.session.passport.user;
    const row = await db.promise().query(`SELECT tipo FROM users WHERE email = '${user}'`);
    return res.render('menuPrincipal.ejs', {tipo: row[0][0].tipo});
});

router.get('/inventario', checkAuthenticated, async (req, res) => {
    const inventario = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ESTADO = 1 ORDER BY produto`);
    const novoInventario = modules.construirInventario(inventario[0]);
    res.render('inventario.ejs', { 
        alimentos: novoInventario
    });
});

router.get('/alimento/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id;
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${id}'`);
    const listaCapacidades = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${id}'`);
    const novaListaCapacidades = modules.construirListaCapacidades(listaCapacidades[0]);

    var body;
    if (Object.keys(req.query).length === 0) {
        body = modules.bodyAlimento(id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, false);
    } else {
        body = modules.bodyAlimento(id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, true);
    }
    res.render('alimento.ejs', body);
});

router.post('/alimento', checkAuthenticated, async (req, res) => {
    const user = req.session.passport.user;
    const nome = await db.promise().query(`SELECT nome FROM users WHERE email = '${user}'`)
    const body = req.body;
    const validade = body.validade + "-01";
    const produto = await db.promise().query(`SELECT produto FROM INVENTARIO WHERE id = '${body.id}'`);
    const alimento = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID = '${body.id}' AND CAPACIDADE= '${body.peso}'`);
    const row = await db.promise().query(`SELECT * FROM VALIDADE WHERE ALIMENTO_ID = '${alimento[0][0].id}' AND DATA = '${validade}'`);

    if(body.add) {
        modules.darEntradaProduto(row[0], nome[0][0].nome, produto[0][0].produto, alimento[0][0].id, validade, body.peso, body.quantidade);
    } else {    
        modules.darSaidaProduto(row[0], nome[0][0].nome, produto[0][0].produto, alimento[0][0].id, validade, body.peso, body.quantidade);
    }

    const link = "/voluntarios/alimento/" + body.id;
    res.redirect(url.format({
        pathname: link,
        query: {
           "message": true
        }
    }));
});

router.get('/outros', checkAuthenticated, (req, res) => {
    if (Object.keys(req.query).length !== 0) {
        res.render('outros.ejs', { 
            message: req.query.message
        });
    } else {
        res.render('outros.ejs');
    }
});

router.post('/outros', checkAuthenticated, async (req, res) => {
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

router.get("/gestaoConta", checkAuthenticated, (req, res) => {
    res.render("gestaoConta.ejs");
});

router.get("/mudarPassword", checkAuthenticated, (req, res) => {
    res.render("mudarPassword.ejs");
});

router.post("/mudarPassword", checkAuthenticated, passwordSchema, validateChangePasswordSchema, (req, res) => {
    const email = req.session.passport.user;
    const oldPassword =  req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword !== confirmPassword) {
        return res.render('mudarPassword.ejs', { 
            message: "Erro",
            listaErros: ['As novas passwords não combinam'] 
        });
    }

    mudarPassword(email, oldPassword, newPassword, res);
});

module.exports = router;