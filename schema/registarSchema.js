const { body } = require('express-validator'); 

const schema = [
    body('email').isEmail().withMessage('Email deve conter um email válido'), 
    body('username').exists({checkFalsy: true}).withMessage('Nome de utilizador deve conter um nome válido'), 
    body('password').isLength({min: 8}).withMessage('Password deve ter pelo menos 6 caracteres')
]

exports.registarSchema = schema;