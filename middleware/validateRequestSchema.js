const { validationResult } = require('express-validator'); 

function validateRegisterSchema (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        var string = "";
        for (var e of errors.array()) {
            string += e.param + " inválido;";
        }
        return res.render('registarUser.ejs', { message: string});
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

exports.validateRegisterSchema = validateRegisterSchema;
exports.validateChangePasswordSchema = validateChangePasswordSchema;