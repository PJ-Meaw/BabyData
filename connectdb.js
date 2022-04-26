const mysql = require('mysql2');

// create the connection to database
/*
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'a7_babydata',
  port: '3306'
});
*/

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'babydata2',
});

module.exports = connection;