const { Router } = require('express');
const bcrypt = require('bcrypt');
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

router.get('/register', modules.authenticated, (req, res) => {
    res.render('register.ejs');
});

router.get('/gerirVoluntarios', modules.authenticated, (req, res) => {
    res.render('gerirVoluntarios.ejs');
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

router.get('/outros', modules.notAuthenticated, async (req, res) => {
    var sql = 'SELECT id, produto, capacidade,' +
            'MONTH(data) AS mes, YEAR(data) AS ano, ' + 
            'quantidade, observacoes FROM outros';

    const data = await db.promise().query(sql);
    res.render('tabelaOutros.ejs', { listaOutros: data[0] });
});

router.get('/delete/outros/:id', modules.notAuthenticated, async (req, res) => {
    console.log('ola')
    await db.promise().query(`DELETE FROM outros WHERE id = '${req.params.id}';`);
    res.redirect('/admin/outros');
});

module.exports = router;