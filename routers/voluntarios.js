const { Router } = require('express');
const db = require('../database');
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/checkAuthenticated');
const { validateChangePasswordSchema } = require('../middleware/validateRequestSchema');
const { passwordSchema } = require('../schema/mudarPasswordSchema.js');
const gerirSotck = require('../modules/gerirStockModule.js');
const { mudarPassword } = require('../modules/mudarPasswordModule.js');

const router = Router();

router.use((req, res, next) => {
    next();
});

router.get('/menuPrincipal', checkAuthenticated, async (req, res) => {
    const user = req.session.passport.user;
    const row = await db.promise().query(`SELECT tipo FROM users WHERE email = '${user}'`);
    return res.render('menuPrincipal.ejs', {tipo: row[0][0].tipo});
});

router.get('/gerirStock', checkAuthenticated, async (req, res) => {
    return res.render('gerirStock.ejs');
});

router.get('/inventario/:acao', checkAuthenticated, async (req, res) => {
    const acao = req.params.acao;
    const inventario = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ESTADO = 1 ORDER BY produto`);
    const novoInventario = gerirSotck.construirInventario(inventario[0]);
    return res.render('inventario.ejs', { 
        alimentos: novoInventario,
        acao: acao
    });
});

router.get('/alimento/add/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id;
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${id}'`);
    const listaCapacidades = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${id}'`);
    const novaListaCapacidades = gerirSotck.construirListaCapacidades(listaCapacidades[0]);

    var body;
    const params = req.flash();
    if (params.type) {
        body = gerirSotck.bodyAlimento("add", id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, params);
    } else {
        body = gerirSotck.bodyAlimento("add", id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, null);
    }
    return res.render('alimento.ejs', body);
});

router.get('/alimento/sub/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id;
    const produto = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ID ='${id}'`);
    const listaCapacidades = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID ='${id}'`);
    const novaListaCapacidades = gerirSotck.construirListaCapacidades(listaCapacidades[0]);

    var body;
    const params = req.flash();
    if (params.type) {
        body = gerirSotck.bodyAlimento("sub", id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, params);
    } else {
        body = gerirSotck.bodyAlimento("sub", id, produto[0][0].produto, produto[0][0].imagem, produto[0][0].observacoes, novaListaCapacidades, produto[0][0].validade, null);
    }
    return res.render('alimento.ejs', body);
});

router.post('/alimento', checkAuthenticated, async (req, res) => {
    const user = req.session.passport.user;
    const username = await db.promise().query(`SELECT nome FROM users WHERE email = '${user}'`)
    const body = req.body;
    const validade = body.validade + "-01";
    const alimento = await db.promise().query(`SELECT * FROM ALIMENTO WHERE INVENTARIO_ID = '${body.id}' AND CAPACIDADE= '${body.peso}'`);
    const row = await db.promise().query(`SELECT * FROM VALIDADE WHERE ALIMENTO_ID = '${alimento[0][0].id}' AND DATA = '${validade}'`);

    if(body.add) {
        gerirSotck.darEntradaProduto(row[0], username[0][0].nome, body.alimento, alimento[0][0].id, validade, body.peso, body.quantidade);
        req.flash('messages', ['Entrada do produto realizada com sucesso']);
    } else {    
        gerirSotck.darSaidaProduto(row[0], username[0][0].nome, body.alimento, alimento[0][0].id, validade, body.peso, body.quantidade);
        req.flash('messages', ['Saída do produto realizada com sucesso']);
    }

    req.flash('type', 'success');
    req.flash('intro', 'Sucesso!');
    
    res.redirect('/voluntarios/alimento/add/' + body.id)
});

router.get('/outros', checkAuthenticated, (req, res) => {
    const params = req.flash();

    if (params.message) {
        return res.render('outros.ejs', { 
            message: params.message
        });
    }

    return res.render('outros.ejs');

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

    req.flash('message', 'Operação feita com sucesso');
    res.redirect('/voluntarios/outros');
});

router.get("/gestaoConta", checkAuthenticated, (req, res) => {
    return res.render("gestaoConta.ejs");
});

router.get("/mudarPassword", checkAuthenticated, (req, res) => {
    return res.render("mudarPassword.ejs");
});

router.post("/mudarPassword", checkAuthenticated, passwordSchema, validateChangePasswordSchema, (req, res) => {
    const email = req.session.passport.user;
    const oldPassword =  req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword !== confirmPassword) {
        return res.render('mudarPassword.ejs', { 
            type: 'error',
            intro: "Erro!",
            messages: ['As novas passwords não combinam'] 
        });
    }

    mudarPassword(email, oldPassword, newPassword, res);
});

router.get("/historico", checkAuthenticated, async (req, res) => {
    const email = req.session.passport.user;
    const row = await db.promise().query(`SELECT nome FROM users WHERE email = '${email}'`);
    const nome = row[0][0].nome;
    const historico = await db.promise().query(`SELECT DATE_FORMAT(data, '%d-%m-%Y') dataonly, 
                                                DATE_FORMAT(data,'%H:%i:%s') timeonly, nome, acao FROM historico WHERE nome = '${nome}'
                                                ORDER BY dataonly DESC, timeonly DESC`);

    return res.render('tabelaHistoricoPessoal.ejs', { 
        historico: historico[0]
    });
});

module.exports = router;