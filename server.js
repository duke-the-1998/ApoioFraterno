if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const { checkNotAuthenticated } = require('./middleware/checkAuthenticated');

const voluntariosRoute = require('./routers/voluntarios');
const adminRoute = require('./routers/admin');
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

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/voluntarios/menuPrincipal',
    failureRedirect: '/login',
    failureFlash: true
}));

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/exitPage');
});

app.get('/exitPage', (req, res) => {
    res.render('exitPage.ejs');
});

//app.use('/auth', authRoute);
app.use('/voluntarios', voluntariosRoute);
app.use('/admin', adminRoute);

app.listen(3000);