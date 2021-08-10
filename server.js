if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const db = require('./database');

const initializePassport = require('./passport-config');
initializePassport(passport);

app.use(express.static(__dirname + '/public'));

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/menuPrincipal',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/menuPrincipal', checkAuthenticated, (req, res) => {
    res.render('menuPrincipal.ejs');
});

app.get('/inventario', checkNotAuthenticated, async (req, res) => {
    const inventario = await db.promise().query(`SELECT * FROM INVENTARIO WHERE ESTADO = 1 ORDER BY produto`);
    const novoInventario = construirArrayInventario(inventario[0]);
    res.render('inventario.ejs', { 
        alimentos: novoInventario
    });
});

app.post('/alimento', checkNotAuthenticated, async (req, res) => {
    const produto = await db.promise().query(`SELECT produto FROM INVENTARIO WHERE ID ='${req.body.id}'`);
    const listaPesos = await db.promise().query(`SELECT * FROM ALIMENTO WHERE ALIMENTO_ID ='${req.body.id}'`);
    const novaListaPesos = construirArrayPeso(listaPesos[0]);

    res.render('alimento.ejs', {
        alimento: produto[0][0].produto,
        pesos: novaListaPesos,
        id: produto[0][0].Id
    });
    
});

app.post('/concluir', checkNotAuthenticated, async (req, res) => {
    const body = req.body;
    console.log(body)
    if(body.Entrar === 'on' && body.Sair === 'on') {
        res.render('alimento.ejs', {message: 'Apenas selecione uma opção'})
    }
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

/**
 * Funcoes auxiliares
 */

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/menuPrincipal');
    }
    next();
}

function construirArrayInventario(array) {
    var newArray = new Array();

    for (var n of array) {
        const obj = {
            alimento: n.produto,
            id: n.Id
        }
        newArray.push(obj);
    }
    return newArray;
}

function construirArrayPeso(array) {
    var newArray = new Array();

    for (var n of array) {
        const obj = {
            peso: n.peso_produto,
            id: n.Id
        }
        newArray.push(obj);
    }
    return newArray;
}
/*app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const username = req.body.nome;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const tipo = "voluntario";
        await db.promise().query(`INSERT INTO USERS (nome,password,tipo) VALUES ('${username}', '${hashedPassword}', '${tipo}')`);
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});*/

app.listen(3000);