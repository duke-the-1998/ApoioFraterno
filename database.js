const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'newuser',
    password: '1135!Sobreda',
    database: 'apoiofraterno',
});
