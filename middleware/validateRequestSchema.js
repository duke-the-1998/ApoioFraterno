const { validationResult } = require('express-validator'); 

function validateRegistarSchema (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        var listaErros = new Array();
        for (var e of errors.array()) {
            listaErros.push(e.msg);
        }
        
        return res.render('registarUser.ejs', { 
            type: 'error',
            intro: "Erro!",
            messages: listaErros 
        });
    }
    next();
}

function validateChangePasswordSchema (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        var listaErros = new Array();
        for (var e of errors.array()) {
            listaErros.push(e.msg);
        }
        
        return res.render('mudarPassword.ejs', { 
            type: 'error',
            intro: "Erro!",
            messages: listaErros 
        });
    }
    next();
}

exports.validateRegistarSchema = validateRegistarSchema;
exports.validateChangePasswordSchema = validateChangePasswordSchema;