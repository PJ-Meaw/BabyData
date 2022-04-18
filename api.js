var db = require('./connectdb');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

var jasonParser = bodyParser.json();

app.use(cors());


app.post('/login', jasonParser, (req, res) => {
    db.execute('SELECT * FROM user WHERE username=?',
    [req.body.username],
    function(err, results, fields) {
// results is arrays like result[0] = {result[0].email, result[0].password, result[0].firstname ,etc.}
// because when we query the data it be like more than 1 results 
        if(err){
            res.json({status: 'error', message: err});
            return           
        }
        if(results.length == 0){
            res.json({status: 'error', message: 'username incorrected'});
            return
        }
        //bcrypt.compare(req.body.password, results[0].password, function(err, nowLogin) {
        if(req.body.password === results[0].password){
            res.json({status: 'ok', message: 'Loging-in Success!!.', username: req.body.username}); 
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
app.post('/details', jasonParser, (req, res) => {
    db.execute('SELECT room_id FROM room WHERE room_type = ?',
    [req.body.room_type],
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
app.post('/get_promotion', jasonParser, (req, res) => {
    db.execute('SELECT promotion_id FROM view_user_promotion WHERE username = ?',
    [req.body.username],
    function(err , results, fields){
        if(err){
            res.json({status: 'error', message: err});
            return           
        }
        else{
            // remove duplicate data in object
            const promotion_of_user = results.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.promotion_id === thing.promotion_id
            ))
            )
            db.execute(
                'SELECT * FROM promotion WHERE out_of_date > ? AND category = "Booking"',
                [req.body.now],
                function(err, results2, fields) {
                    if(err) throw(err);
                    else{
                    const compareresult = results2
                    const finalresult = {
                        promotion_id: [],
                        discount: []
                    }
                    for(let i = 0 ; i< promotion_of_user.length ; i++){
                        for(let j = 0; j < compareresult.length ; j++){
                            if(promotion_of_user[i].promotion_id === compareresult[j].promotion_id){
                                finalresult.promotion_id.push(promotion_of_user[i].promotion_id); // push promotion_id
                                finalresult.discount.push(compareresult[j].discount) // push discount
                            }
                        }
                    }
                    res.json({finalresult}) // if finalresult length == 0 is no promotion user can't use
                    }
                }     
            );
            //res.json({status: 'ok' , message: 'success query', promotion_of_user})
        }

    }
    )
});

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