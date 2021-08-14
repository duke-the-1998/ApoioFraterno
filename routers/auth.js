const { Router } = require('express');
const passport = require('passport');
const initializePassport = require('../passport-config');
const modules = require('../module');

const router = Router();
initializePassport(passport);

router.use((req, res, next) => {
    next();
})

router.get('/', async (req, res) => {
    res.redirect('/login');
});

router.get('/login', modules.notAuthenticated, (req, res) => {
    res.render('login.ejs')
});

router.post('/login', modules.notAuthenticated, passport.authenticate('local', {
    successRedirect: '/users/menuPrincipal',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

module.exports = router;