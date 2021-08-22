const { validationResult } = require('express-validator'); 

function validateRequestSchema (req, res, next) {
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

exports.validateRequestSchema = validateRequestSchema;