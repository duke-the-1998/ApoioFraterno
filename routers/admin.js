const { Router } = require('express');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const db = require('../database');
const { checkAuthenticated } = require('../middleware/checkAuthenticated');
const { checkAdmin } = require('../middleware/checkAdmin');
const { validateRegistarSchema } = require('../middleware/validateRequestSchema');
const { registarSchema } = require('../schema/registarSchema');
const { inserirNoInventario, inserirCapacidade } = require('../modules/criarAlimentoModule');
const { construirAlimentoInventario, construirMinMax, construirRangeCapacidades , updateInventario} = require ('../modules/tabelaAlimentosModule');

const router = Router();
router.use(fileUpload());

router.use((req, res, next) => {
    next();
});

router.get('/menu', checkAuthenticated, checkAdmin, (req, res) => {
    return res.render('menuAdmin.ejs');
});

router.get('/gerirUtilizadores', checkAuthenticated, checkAdmin, (req, res) => {
    return res.render('gerirUtilizadores.ejs');
});

router.get('/registarUser', checkAuthenticated, checkAdmin, (req, res) => {
    return res.render('registarUser.ejs');
});

router.post('/registarUser', checkAuthenticated, checkAdmin, registarSchema, validateRegistarSchema, async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const row = await db.promise().query(`SELECT nome, email FROM USERS WHERE nome = '${username}' OR email = '${email}'`);
        if (row[0].length !== 0) {
            if (row[0][0].nome === username) {
                return res.render('registarUser.ejs', {
                    type: 'error',
                    intro: 'Erro!',
                    messages: ['Já existe um utilizador com este nome registado']
                });
            }
            return res.render('registarUser.ejs', {
                type: 'error',
                intro: 'Erro!',
                messages: ['Já existe um utilizador com este email registado']
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        var tipo;
        if (req.body.admin) {
            tipo = "admin"
        } else {
            tipo = "voluntário"
        }

        await db.promise().query(`INSERT INTO USERS (nome, email, password, tipo) VALUES ('${username}', '${req.body.email}', '${hashedPassword}', '${tipo}')`);
        return res.render('registarUser.ejs', { 
            type: 'success',
            intro: 'Sucesso!', 
            messages: ['Utilizador registado com sucesso']
        });
    } catch {
        res.render('registarUser.ejs', {
            type: 'error',
            intro: 'Erro!', 
            listaErros: ['O servidor não conseguiu concluir o registo por algum motivo']
        });
    }
});

router.get('/tabelaUsers', checkAuthenticated, checkAdmin, async (req, res) => {
    const data = await db.promise().query('SELECT nome, email, tipo FROM users');
    const params = req.flash();

    if (!params.type) {
        res.render('tabelaUsers.ejs', { listaUsers: data[0] });
    } else {
        res.render('tabelaUsers.ejs', {
            listaUsers: data[0],
            type: params.type,
            intro: params.intro, 
            messages: params.messages
        });
    }
});

router.get('/delete/user/:email', checkAuthenticated, checkAdmin, async (req, res) => {
    const user = req.session.passport.user;
    if (user === req.params.email) {
        req.flash('type', 'info');
        req.flash('intro', 'Info!');
        req.flash('messages', ['Não é possível eliminar-se a si próprio']);
        return res.redirect('/admin/tabelaUsers');
    }
    await db.promise().query(`DELETE FROM users WHERE email = '${req.params.email}';`);
    req.flash('type', 'success');
    req.flash('intro', 'Sucesso!');
    req.flash('messages', ['Utilizador apagado com sucesso']);
    return res.redirect('/admin/tabelaUsers');
});

router.get('/consultarStock', checkAuthenticated, checkAdmin, (req, res) => {
    return res.render('consultarStock.ejs');
});

router.get('/outros', checkAuthenticated, checkAdmin, async (req, res) => {
    var sql = 'SELECT id, produto, capacidade,' +
        'MONTH(data) AS mes, YEAR(data) AS ano, ' +
        'quantidade, observacoes FROM outros';

    const data = await db.promise().query(sql);
    const params = req.flash();

    if (!params.type) {
        return res.render('tabelaOutros.ejs', { listaOutros: data[0] });
    }

    return res.render('tabelaOutros.ejs', {
        listaOutros: data[0],
        type: params.type,
        intro: params.intro, 
        messages: params.messages

    });
});

router.get('/delete/outros/:id', checkAuthenticated, checkAdmin, async (req, res) => {
    await db.promise().query(`DELETE FROM outros WHERE id = '${req.params.id}';`);

    req.flash('type', 'success');
    req.flash('intro', 'Sucesso!');
    req.flash('messages', ['Alimento apagado com sucesso']);
    return res.redirect('/admin/outros');
});
router.get('/tabelaAlimento', checkAuthenticated, async (req, res) => {
    var sql = 'SELECT i.id as id_inven, i.produto as produto , a.capacidade as capacidade, v.data as data, v.quantidade as quantidade, i.observacoes as observacoes, i.estado as estado FROM inventario i LEFT JOIN alimento a ON i.id = a.inventario_id LEFT JOIN validade v ON a.id = v.alimento_id ORDER BY i.produto ASC , a.capacidade ASC';

    var alimentoInventario = await db.promise().query(sql);
    var rangeAnosValidade = await db.promise().query('SELECT MIN(YEAR (v.data)) as minimo, MAX(YEAR (v.data)) as maximo FROM validade v');
    var rangeCapacidades = await db.promise().query('SELECT a.inventario_id as id_inventario , COUNT(a.inventario_id) as num_ocurrencias FROM alimento a GROUP BY a.inventario_id') ;
    var novoAlimentoInventario = construirAlimentoInventario(alimentoInventario[0]);
    var novorangeAnosValidade = construirMinMax(rangeAnosValidade[0]);
    var novoRangeCapacidades = construirRangeCapacidades(rangeCapacidades[0]);
    res.render('tabelaAlimentos.ejs', { 
        rangeCapacidades: novoRangeCapacidades,
        alimentoInventario: novoAlimentoInventario,
        rangeAnosValidade: novorangeAnosValidade
    });
});

router.get('/criarAlimento', checkAuthenticated, checkAdmin, (req, res) => {
    return res.render('criarAlimento.ejs');
});

router.post('/criarAlimento', checkAuthenticated, checkAdmin, async (req, res) => {
    const nome = req.body.nome;
    const capacidade = req.body.capacidade;
    const observacoes = req.body.observacoes;
    const file = req.files.imagem;
    const uploadPath = './public/images/Alimentos/' + file.name
    var validade = "off";
    if (req.body.validade != 'undefined') validade = req.body.validade;

    const error = await inserirNoInventario(nome, file.name, observacoes, validade);
    if (error === "ER_DUP_ENTRY") {
        req.flash('type', 'error');
        req.flash('intro', 'Erro!');
        req.flash('messages', ['Já existe um alimento com este nome']);
        return res.redirect('/admin/outros')
    }

    inserirCapacidade(nome, capacidade);
    file.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
    });

    req.flash('type', 'success');
    req.flash('intro', 'Sucesso!');
    req.flash('messages', ['Alimento adicionado com sucesso']);
    return res.redirect('/admin/outros');

});

router.post('/updateInventario', checkAuthenticated, checkAdmin, async (req, res) => {
    const observacoes = req.body.obs;
    const id = req.body.id;
    var estado = req.body.estado || "off";
    var capacidade = req.body.capacidade;
    const error = await updateInventario(id, observacoes, estado,capacidade);
    req.flash('erro nigga',error);
    res.redirect("/admin/tabelaAlimento");
    
});

router.get("/relatorio", checkAuthenticated, async (req, res) => {
    const historico = await db.promise().query(`SELECT DATE_FORMAT(data, '%d-%m-%Y') dataonly, 
                                                DATE_FORMAT(data,'%H:%i:%s') timeonly, nome, acao FROM historico
                                                ORDER BY dataonly DESC, timeonly DESC`);

    return res.render('tabelaHistoricoGeral.ejs', {
        historico: historico[0]
    });
});

module.exports = router;