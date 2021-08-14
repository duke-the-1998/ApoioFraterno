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
    res.render('register.ejs')
});

router.post('/register', modules.authenticated, async (req, res) => {
    try {
        const username = req.body.username;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const tipo = "voluntario";
        await db.promise().query(`INSERT INTO USERS (nome,password,tipo) VALUES ('${username}', '${hashedPassword}', '${tipo}')`);
        res.redirect('/admin/register/sucesso');
    } catch {
        res.redirect('/admin/register/insucesso');
    }
});

module.exports = router;