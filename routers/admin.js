const { Router } = require('express');
const url = require('url');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const db = require('../database');
const { checkAuthenticated } = require('../middleware/checkAuthenticated');
const { validateRegisterSchema } = require('../middleware/validateRequestSchema');
const { registarSchema } = require('../schema/registarSchema');
const { inserirNoInventario, inserirCapacidade } = require('../modules/criarAlimentoModule');

const router = Router();
router.use(fileUpload());

router.use((req, res, next) => {
    next();
});

router.get('/menu', checkAuthenticated, (req, res) => {
    return res.render('menuAdmin.ejs');
});

router.get('/gerirUtilizadores', checkAuthenticated, (req, res) => {
    res.render('gerirUtilizadores.ejs');
});

router.get('/registarUser', checkAuthenticated, (req, res) => {
    res.render('registarUser.ejs');
});

router.post('/registarUser', checkAuthenticated, registarSchema, validateRegisterSchema, async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const row = await db.promise().query(`SELECT nome, email FROM USERS WHERE nome = '${username}' OR email = '${email}'`);
        if (row[0].length !== 0) {
            if (row[0][0].nome === username) {
                res.render('registarUser.ejs', { message: 'Já existe um utilizador com este nome registado'});
            } else if (row[0][0].email === email) {
                res.render('registarUser.ejs', { message: 'Já existe um utilizador com este email registado'});
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
            res.render('registarUser.ejs', { message: 'sucesso'});
        }
    } catch {
        res.render('registarUser.ejs', { message: 'O servidor não conseguiu concluir o registo por algum motivo'});
    }
});

router.get('/tabelaUsers', checkAuthenticated, async (req, res) => {
    const data = await db.promise().query('SELECT nome, email, tipo FROM users');

    if (Object.keys(req.query).length === 0) {
        res.render('tabelaUsers.ejs', { listaUsers: data[0] });
    } else {
        res.render('tabelaUsers.ejs', { 
            listaUsers: data[0],
            sucesso: req.query.sucesso,
            message: req.query.message });
    }
});

router.get('/delete/user/:email', checkAuthenticated, async (req, res) => {
    const user = req.session.passport.user;
    if (user === req.params.email) {
        res.redirect(url.format({
            pathname: '/admin/tabelaUsers',
            query: {
                "sucesso": false,
                "message": "Não é possível eliminar-se a si próprio"
            }
        }));
    } else {
        await db.promise().query(`DELETE FROM users WHERE email = '${req.params.email}';`);
        res.redirect(url.format({
            pathname: '/admin/tabelaUsers',
            query: {
                "sucesso": true,
                "message": "Utilizador apagado com sucesso"
            }
        }));
    }
    
});

router.get('/consultarStock', checkAuthenticated, (req, res) => {
    res.render('consultarStock.ejs');
});

router.get('/outros', checkAuthenticated, async (req, res) => {
    var sql = 'SELECT id, produto, capacidade,' +
            'MONTH(data) AS mes, YEAR(data) AS ano, ' + 
            'quantidade, observacoes FROM outros';

    const data = await db.promise().query(sql);
    
    if (Object.keys(req.query).length === 0) {
        res.render('tabelaOutros.ejs', { listaOutros: data[0] });
    } else {
        res.render('tabelaOutros.ejs', { 
            listaOutros: data[0],
            message: "Alimento apagado com sucesso"
        });
    } 
});

router.get('/delete/outros/:id', checkAuthenticated, async (req, res) => {
    await db.promise().query(`DELETE FROM outros WHERE id = '${req.params.id}';`);
    res.redirect(url.format({
        pathname: '/admin/outros',
        query: {
           "message": true
        }
    }));
});
router.get('/tabela', modules.authenticated, async (req, res) => {
    const alimentoInventario = await db.promise().query(`SELECT * 
    FROM INVENTARIO i 
    LEFT JOIN Alimento ON Alimento.inventario_id = i.id
    ORDER BY i.produto`);
    const novoAlimentoInventario = modules.alimentoInventario(alimentoInventario[0]);
    res.render('tabelaAlimentos.ejs', { 
        alimentoInventario: novoAlimentoInventario
    });
});

router.get('/criarAlimento', checkAuthenticated, (req, res) => {
    res.render('criarAlimento.ejs');
});

router.post('/criarAlimento', checkAuthenticated, async (req, res) => {
    const nome = req.body.nome;
    const capacidade = req.body.capacidade;
    const observacoes = req.body.observacoes;
    const file = req.files.imagem;
    const uploadPath = './public/imagens/Alimentos/' + file.name
    var validade = "off";
    if (req.body.validade != 'undefined') validade = req.body.validade;


    inserirNoInventario(nome, file.name, observacoes, validade);
    inserirCapacidade(nome, capacidade);

    file.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
    });

    res.redirect('/admin/outros')
});

module.exports = router;