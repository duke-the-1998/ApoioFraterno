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

router.get('/outros', async (req, res) => {
    var sql = 'SELECT produto, capacidade,' +
            'MONTH(data) AS mes, YEAR(data) AS ano, ' + 
            'quantidade, observacoes FROM outros';
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('tabelaOutros.ejs', { listaOutros: data});
  });
});

module.exports = router;