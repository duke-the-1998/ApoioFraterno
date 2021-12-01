if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const fs = require('fs');
const https = require('https');

const voluntariosRoute = require('./routers/voluntarios');
const adminRoute = require('./routers/admin');
const authRoute = require('./routers/auth');

//certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/apoiofraterno.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/apoiofraterno.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/apoiofraterno.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

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

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
    console.log('listening on port 8080')
});
