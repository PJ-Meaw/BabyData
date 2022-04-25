const mysql = require('mysql2');

// create the connection to database
var connection = mysql.createConnection({
  host: '202.28.7.92',
  user: 'a7_cpe231',
  password: '123456789',
  database: 'a7_babydata2',
  port: '8090'
});
/*
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'babydata2',
});
*/
module.exports = connection;