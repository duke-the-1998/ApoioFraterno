const { body } = require('express-validator'); 

const schema = [
    body('newPassword').isLength({min: 8}).withMessage('A nova password deve ter pelo menos 8 caracteres'),
]

exports.passwordSchema = schema;