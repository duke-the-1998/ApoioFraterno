const { Router } = require('express');
const passport = require('passport');
const initializePassport = require('../passport-config');
const { checkNotAuthenticated } = require('../middleware/checkAuthenticated');

const router = Router();
initializePassport(passport);

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

module.exports = router;