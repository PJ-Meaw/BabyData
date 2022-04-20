var mysql = require('mysql2');

// create the connection to database
var connection = mysql.createConnection({
  host: '202.28.7.92',
  user: 'root',
  //password: '123456789',
  database: 'a7_babydata2',
  port: '8090'
});

module.exports = connection;