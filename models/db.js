const mysql = require('mysql2/promise');

const dbConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysqlnikolaos',
  database: 'connect.oll',
  multipleStatements: true,
});

module.exports = dbConnection;
