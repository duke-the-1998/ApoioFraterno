const { Router } = require('express');
const url = require('url');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const db = require('../database');
const { checkAuthenticated,checkNotAuthenticated } = require('../middleware/checkAuthenticated');
const { checkAdmin } = require('../middleware/checkAdmin');
const { validateRegistarSchema } = require('../middleware/validateRequestSchema');
const { registarSchema } = require('../schema/registarSchema');
const { inserirNoInventario, inserirCapacidade } = require('../modules/criarAlimentoModule');
const { construirAlimentoInventario, construirMinMax } = require ('../modules/tabelaAlimentosModule');

const router = Router();
router.use(fileUpload());

router.use((req, res, next) => {
    next();
});

router.get('/menu', checkAuthenticated, checkAdmin, (req, res) => {
    return res.render('menuAdmin.ejs');
});

router.get('/gerirUtilizadores', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('gerirUtilizadores.ejs');
});

router.get('/registarUser', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('registarUser.ejs');
});

router.post('/registarUser', checkAuthenticated, checkAdmin, registarSchema, validateRegistarSchema, async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const row = await db.promise().query(`SELECT nome, email FROM USERS WHERE nome = '${username}' OR email = '${email}'`);
        if (row[0].length !== 0) {
            if (row[0][0].nome === username) {
                res.render('registarUser.ejs', {
                    message: "Erro",
                    listaErros: ['Já existe um utilizador com este nome registado']
                });
            } else if (row[0][0].email === email) {
                res.render('registarUser.ejs', {
                    message: "Erro",
                    listaErros: ['Já existe um utilizador com este email registado']
                });
            }
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            var tipo;
            if (req.body.admin) {
                tipo = "admin"
            } else {
                tipo = "voluntario";
            }
            await db.promise().query(`INSERT INTO USERS (nome, email, password, tipo) VALUES ('${username}', '${req.body.email}', '${hashedPassword}', '${tipo}')`);
            res.render('registarUser.ejs', { message: 'sucesso' });
        }
    } catch {
        res.render('registarUser.ejs', {
            message: "Erro",
            listaErros: ['O servidor não conseguiu concluir o registo por algum motivo']
        });
    }
});

router.get('/tabelaUsers', checkAuthenticated, checkAdmin, async (req, res) => {
    const data = await db.promise().query('SELECT nome, email, tipo FROM users');

    if (Object.keys(req.query).length === 0) {
        res.render('tabelaUsers.ejs', { listaUsers: data[0] });
    } else {
        res.render('tabelaUsers.ejs', {
            listaUsers: data[0],
            sucesso: req.query.sucesso,
            message: req.query.message
        });
    }
});

router.get('/delete/user/:email', checkAuthenticated, checkAdmin, async (req, res) => {
    const user = req.session.passport.user;
    if (user === req.params.email) {
        return res.redirect(url.format({
            pathname: '/admin/tabelaUsers',
            query: {
                "sucesso": false,
                "message": "Não é possível eliminar-se a si próprio"
            }
        }));
    }
    await db.promise().query(`DELETE FROM users WHERE email = '${req.params.email}';`);
    res.redirect(url.format({
        pathname: '/admin/tabelaUsers',
        query: {
            "sucesso": true,
            "message": "Utilizador apagado com sucesso"
        }
    }));
});

router.get('/estado/desativar/:id', checkAuthenticated, checkAdmin, async (req, res) => {
    await db.promise().query(`UPDATE inventario SET estado=0 WHERE id = '${req.params.id}';`);
    res.redirect(url.format({
        pathname: '/admin/tabela'
    }));
});

router.get('/estado/ativar/:id', checkAuthenticated, checkAdmin, async (req, res) => {
    await db.promise().query(`UPDATE inventario SET estado=1 WHERE id = '${req.params.id}';`);
    res.redirect(url.format({
        pathname: '/admin/tabela'
    }));
});

router.get('/consultarStock', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('consultarStock.ejs');
});

router.get('/outros', checkAuthenticated, checkAdmin, async (req, res) => {
    var sql = 'SELECT id, produto, capacidade,' +
        'MONTH(data) AS mes, YEAR(data) AS ano, ' +
        'quantidade, observacoes FROM outros';

    const data = await db.promise().query(sql);

    if (Object.keys(req.query).length === 0) {
        res.render('tabelaOutros.ejs', { listaOutros: data[0] });
    } else {
        res.render('tabelaOutros.ejs', {
            listaOutros: data[0],
            sucesso: req.query.sucesso,
            message: req.query.message
        });
    }
});

router.get('/delete/outros/:id', checkAuthenticated, checkAdmin, async (req, res) => {
    await db.promise().query(`DELETE FROM outros WHERE id = '${req.params.id}';`);
    res.redirect(url.format({
        pathname: '/admin/outros',
        query: {
            "sucesso": true,
            "message": "Alimento apagado com sucesso"
        }
    }));
});
router.get('/tabela', checkAuthenticated, async (req, res) => {
    var sql = 'SELECT i.id as id_inven, i.produto as produto , a.capacidade as capacidade, v.data as data, v.quantidade as quantidade, i.observacoes as observacoes, i.estado as estado FROM inventario i LEFT JOIN alimento a ON i.id = a.inventario_id LEFT JOIN validade v ON a.id = v.alimento_id ORDER BY i.produto ASC , a.capacidade ASC';

    var alimentoInventario = await db.promise().query(sql);
    var rangeAnosValidade = await db.promise().query('SELECT MIN(YEAR (v.data)) as minimo, MAX(YEAR (v.data)) as maximo FROM validade v');
    var novoAlimentoInventario = construirAlimentoInventario(alimentoInventario[0]);
    var novorangeAnosValidade = construirMinMax(rangeAnosValidade[0]);
    res.render('tabelaAlimentos.ejs', { 
        alimentoInventario: novoAlimentoInventario,
        rangeAnosValidade: novorangeAnosValidade
    });
});

router.get('/criarAlimento', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('criarAlimento.ejs');
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
        return res.redirect(url.format({
            pathname: '/admin/outros',
            query: {
                "sucesso": false,
                "message": "Já existe um produto com este nome"
            }
        }));
    }

    inserirCapacidade(nome, capacidade);
    file.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
    });

    res.redirect(url.format({
        pathname: '/admin/outros',
        query: {
            "sucesso": true,
            "message": "Alimento adicionado com sucesso"
        }
    }));

});

router.get("/relatorio", checkAuthenticated, async (req, res) => {
    const historico = await db.promise().query(`SELECT DATE_FORMAT(data, '%d-%m-%Y') dataonly, 
                                                DATE_FORMAT(data,'%H:%i:%s') timeonly, nome, acao FROM historico
                                                ORDER BY dataonly DESC, timeonly DESC`);

    return res.render('tabelaHistoricoPessoal.ejs', {
        historico: historico[0]
    });
});

module.exports = router;