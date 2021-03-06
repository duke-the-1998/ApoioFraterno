const bcrypt = require('bcrypt');
const db = require('../database');

async function mudarPassword(email, oldPassword, newPassword, res) {
    const row = await db.promise().query(`SELECT * FROM users WHERE email = '${email}'`);
    if (await bcrypt.compare(oldPassword, row[0][0].password)) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.promise().query(`UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}'`);
        
        return res.render('mudarPassword.ejs', {
            type: 'success',
            intro: "Sucesso!",
            messages: ['As novas passwords não combinam']
        });
    }
    
    return res.render('mudarPassword.ejs', {
        type: 'error',
        intro: "Erro!",
        messages: ['Password antiga incorreta']
    });
}

exports.mudarPassword = mudarPassword;