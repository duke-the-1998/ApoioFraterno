const { Router } = require('express');
const passport = require('passport');
const initializePassport = require('../passport-config');
const { checkNotAuthenticated } = require('../middleware/checkAuthenticated');
const methodOverride = require('method-override');

const router = Router();
initializePassport(passport);

router.use(methodOverride('_method'))

router.use((req, res, next) => {
    next();
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/voluntarios/menuPrincipal',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/exitPage');
});

module.exports = router;