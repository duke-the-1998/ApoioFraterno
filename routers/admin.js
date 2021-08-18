const { Router } = require('express');
const url = require('url');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const db = require('../database');
const modules = require('../module');

//const { check, validationResult } = require('express-validator');

const router = Router();

router.use((req, res, next) => {
    next();
});

router.get('/menu', modules.authenticated, (req, res) => {
    return res.render('menuAdmin.ejs');
});

router.get('/gerirVoluntarios', modules.authenticated, (req, res) => {
    res.render('gerirVoluntarios.ejs');
});

router.get('/registarUser', modules.authenticated, (req, res) => {
    res.render('registarUser.ejs');
});

router.post('/register', modules.authenticated, async (req, res) => {
    try {
        const username = req.body.username;
        const row = await db.promise().query(`SELECT nome FROM USERS`);
        if (row[0][0].nome === username) {
            res.render('register.ejs', { message: 'username'});
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const tipo = "voluntario";
            await db.promise().query(`INSERT INTO USERS (nome,password,tipo) VALUES ('${username}', '${hashedPassword}', '${tipo}')`);
            res.render('register.ejs', { message: 'sucesso'});
        }
    } catch {
        res.render('register.ejs', { message: 'fail'});
    }
});

router.get('/tabelaUsers', modules.authenticated, async (req, res) => {
    var sql = 'SELECT nome, email, tipo FROM users';

    const data = await db.promise().query(sql);
    res.render('tabelaUsers.ejs', { listaUsers: data[0] });
});

router.get('/delete/user/:email', modules.authenticated, async (req, res) => {
    await db.promise().query(`DELETE FROM users WHERE email = '${req.params.email}';`);
    res.redirect('/admin/tabelaUsers');
});

router.get('/outros', modules.notAuthenticated, async (req, res) => {
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

router.get('/delete/outros/:id', modules.notAuthenticated, async (req, res) => {
    await db.promise().query(`DELETE FROM outros WHERE id = '${req.params.id}';`);
    res.redirect(url.format({
        pathname: '/admin/outros',
        query: {
           "message": true
        }
    }));
});

router.get('/criarAlimento', modules.notAuthenticated, (req, res) => {
    res.render('criarAlimento.ejs');
});

router.post('/criarAlimento', modules.notAuthenticated, async (req, res) => {

})

module.exports = router;