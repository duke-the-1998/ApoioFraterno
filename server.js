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
const modules = require('./module');

const voluntariosRoute = require('./routers/voluntarios');
//const authRoute = require('./routers/auth');

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

app.use((req, res, next) => {
    next();
})

app.get('/', async (req, res) => {
    res.redirect('/login');
});

app.get('/login', modules.notAuthenticated, (req, res) => {
    res.render('login.ejs')
});

app.post('/login', modules.notAuthenticated, passport.authenticate('local', {
    successRedirect: '/voluntarios/menuPrincipal',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/menuAdmin', modules.authenticated, (req, res) => {
    return res.render('menuAdmin.ejs');
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/exitPage');
});

app.get('/exitPage', (req, res) => {
    res.render('exitPage.ejs');
});

app.get('/register', modules.authenticated, (req, res) => {
    res.render('register.ejs')
});

app.post('/register', modules.authenticated, async (req, res) => {
    try {
        const username = req.body.nome;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const tipo = "voluntario";
        await db.promise().query(`INSERT INTO USERS (nome,password,tipo) VALUES ('${username}', '${hashedPassword}', '${tipo}')`);
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

//app.use('/auth', authRoute);
app.use('/voluntarios', voluntariosRoute);

app.listen(3000);