const db = require('../database');

async function checkAdmin (req, res, next) {
    const user = req.session.passport.user;
    const row = await db.promise().query(`SELECT tipo FROM users WHERE email = '${user}'`);
    const tipo = row[0][0].tipo;
    
    if (tipo === "admin") {
        return next();
    } 
    return res.redirect('/voluntarios/menuPrincipal');
}

exports.checkAdmin = checkAdmin;