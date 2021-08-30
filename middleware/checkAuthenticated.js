function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/voluntarios/menuPrincipal');
    }
    next();
}

exports.checkAuthenticated = checkAuthenticated;
exports.checkNotAuthenticated = checkNotAuthenticated;