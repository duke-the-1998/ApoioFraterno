const { validationResult } = require('express-validator'); 

function validateRegistarSchema (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        var listaErros = new Array();
        for (var e of errors.array()) {
            listaErros.push(e.msg);
        }
        
        return res.render('registarUser.ejs', { 
            message: "Erro",
            listaErros: listaErros 
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
            message: "Erro",
            listaErros: listaErros 
        });
    }
    next();
}

exports.validateRegistarSchema = validateRegistarSchema;
exports.validateChangePasswordSchema = validateChangePasswordSchema;