const { Router } = require('express');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const db = require('../database');
const { checkAuthenticated } = require('../middleware/checkAuthenticated');
const { checkAdmin } = require('../middleware/checkAdmin');
const { validateRegistarSchema } = require('../middleware/validateRequestSchema');
const { registarSchema } = require('../schema/registarSchema');
const { inserirNoInventario, inserirCapacidade } = require('../modules/criarAlimentoModule');
const { construirAlimentoInventario, construirMinMax, construirRangeCapacidades , 
    updateInventario, deleteInventario, deleteImage} = require ('../modules/tabelaAlimentosModule');

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

        await db.promise().query(`INSERT INTO users (nome, email, password, tipo) VALUES ('${username}', '${req.body.email}', '${hashedPassword}', '${tipo}')`);
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
    const sql = `SELECT nome, email, tipo FROM users
                    EXCEPT ( SELECT nome, email, tipo FROM users WHERE email = "sobreda@diocese.setubal.pt")`; 
    const data = await db.promise().query(sql);
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

router.get('/tabelaAlimento', checkAuthenticated, async (req, res) => {
    const sql = 'SELECT i.id as id_inven, i.produto as produto , a.capacidade as capacidade, v.data as data, v.quantidade as quantidade, i.observacoes as observacoes, i.estado as estado FROM inventario i LEFT JOIN alimento a ON i.id = a.inventario_id LEFT JOIN validade v ON a.id = v.alimento_id ORDER BY i.produto ASC , a.capacidade ASC';

    const alimentoInventario = await db.promise().query(sql);
    const rangeAnosValidade = await db.promise().query('SELECT MIN(YEAR (v.data)) as minimo, MAX(YEAR (v.data)) as maximo FROM validade v');
    const rangeCapacidades = await db.promise().query('SELECT a.inventario_id as id_inventario , COUNT(a.inventario_id) as num_ocurrencias FROM alimento a GROUP BY a.inventario_id') ;
    const novoAlimentoInventario = construirAlimentoInventario(alimentoInventario[0]);
    const novorangeAnosValidade = construirMinMax(rangeAnosValidade[0]);
    const novoRangeCapacidades = construirRangeCapacidades(rangeCapacidades[0]);

    const params = req.flash();
    res.render('tabelaAlimentos.ejs', { 
        rangeCapacidades: novoRangeCapacidades,
        alimentoInventario: novoAlimentoInventario,
        rangeAnosValidade: novorangeAnosValidade,
        type: params.type,
        intro: params.intro, 
        messages: params.messages
    });
});

router.post('/updateInventario', checkAuthenticated, checkAdmin, async (req, res) => {
    const observacoes = req.body.obs;
    const id = req.body.id;
    const estado = req.body.estado || "off";
    const capacidade = req.body.capacidade;
    updateInventario(id, observacoes, estado, capacidade);
    
    req.flash('type', 'success');
    req.flash('intro', 'Sucesso!');
    req.flash('messages', ['Alimento atualizado']);
    res.redirect("/admin/tabelaAlimento");
    
});

router.get('/deleteAlimento/:id', checkAuthenticated, checkAdmin, async (req, res) => {
    const id = req.params.id;
    deleteInventario(id);
    deleteImage(id);

    req.flash('type', 'success');
    req.flash('intro', 'Sucesso!');
    req.flash('messages', ['Alimento atualizado']);
    res.redirect("/admin/tabelaAlimento");

});

router.get("/relatorio", checkAuthenticated, async (req, res) => {
    const user = req.session.passport.user;
    const row = await db.promise().query(`SELECT tipo FROM users WHERE email = '${user}'`);
    const historico = await db.promise().query(`SELECT DATE_FORMAT(data, '%d-%m-%Y') dataonly, 
                                                DATE_FORMAT(data,'%H:%i:%s') timeonly, nome, acao, id FROM historico
                                                ORDER BY dataonly DESC, timeonly DESC`);

    const params = req.flash();
    return res.render('tabelaHistoricoGeral.ejs', {
        tipo: row[0][0].tipo,
        historico: historico[0],
        type: params.type,
        intro: params.intro, 
        messages: params.messages
    });
});

router.get('/delete/historico/:id', checkAuthenticated, checkAdmin, async (req, res) => {
    const id = req.params.id;
    db.promise().query(`DELETE FROM historico WHERE id = '${id}'`);
    
    req.flash('type', 'success');
    req.flash('intro', 'Sucesso!');
    req.flash('messages', ['Linha do histórico eliminada']);
    res.redirect("/admin/relatorio");

});

module.exports = router;