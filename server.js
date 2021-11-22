if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const voluntariosRoute = require('./routers/voluntarios');
const adminRoute = require('./routers/admin');
const authRoute = require('./routers/auth');

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

app.use((req, res, next) => {
    next();
})

app.get('/', async (req, res) => {
    res.redirect('/auth/login');
}); 

app.get('/exitPage', (req, res) => {
    res.render('exitPage.ejs');
});

app.use('/auth', authRoute);
app.use('/voluntarios', voluntariosRoute);
app.use('/admin', adminRoute);

app.listen(8080, () => {
    console.log('listening on port 8080')
});