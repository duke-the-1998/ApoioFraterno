const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sobreda1135!',
    database: 'apoiofraterno',
});
