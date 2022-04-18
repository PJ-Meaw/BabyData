var db = require('./connectdb');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

var jasonParser = bodyParser.json();

app.use(cors());


app.post('/login', jasonParser, (req, res) => {
    db.execute('SELECT * FROM userid WHERE user_id=?',
    [req.body.user_id],
    function(err, results, fields) {
// results is arrays like result[0] = {result[0].email, result[0].password, result[0].firstname ,etc.}
// because when we query the data it be like more than 1 results 
        if(err){
            res.json({status: 'error', message: err});
            return           
        }
        if(results.length == 0){
            res.json({status: 'error', message: 'user-id incorrected'});
            return
        }
        //bcrypt.compare(req.body.password, results[0].password, function(err, nowLogin) {
        if(req.body.password === results[0].password){
            res.json({status: 'ok', message: 'Loging-in Success!!.', user_id: req.body.user_id}); 
            }
        else{
            res.json({status: 'error', message: 'Loging-in Failed!!.'});
            }
        //});
        
    }
    )
})
app.post('/now_log', jasonParser, (req, res) => {
    db.execute('SELECT username FROM userid WHERE user_id = ?',
    [req.body.user_id],
    function(err , results, fields){
        if(err){
            res.json({status: 'error', message: err});
            return           
        }
        else{
            res.json({status: 'ok' , message: 'success query', username: results[0]})
        }
        
    }
    )
})
app.get('/home', jasonParser, (req, res) => {
    db.execute('')
})
app.get('/home', jasonParser, (req, res) => {
    db.execute('')
})
app.get('/home', jasonParser, (req, res) => {
    db.execute('')
})

app.listen(3333, function() {
    console.log('Server is Running on port 3333...')
})