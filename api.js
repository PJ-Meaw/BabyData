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
    db.execute('SELECT room_id FROM room WHERE branch = ?',
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
    db.execute('SELECT promotion_id,user_and_promotion FROM view_user_promotion WHERE username = ?',
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
                t.promotion_id === thing.promotion_id && t.user_and_promotion === thing.user_and_promotion
            ))
            )
            db.execute(
                'SELECT * FROM promotion WHERE out_of_date > ? AND category = ?',
                [req.body.now,req.body.category],
                function(err, results2, fields) {
                    if(err) console.log(err);
                    else{
                    const compareresult = results2
                    const finalresult = {
                        promotion_id: [],
                        discount: [],
                        user_and_promotion: []
                    }
                    for(let i = 0 ; i< promotion_of_user.length ; i++){
                        for(let j = 0; j < compareresult.length ; j++){
                            if(promotion_of_user[i].promotion_id === compareresult[j].promotion_id){
                                finalresult.promotion_id.push(promotion_of_user[i].promotion_id); // push promotion_id
                                finalresult.discount.push(compareresult[j].discount) // push discount
                                finalresult.user_and_promotion.push(promotion_of_user[i].user_and_promotion)
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

app.post('/get_room', jasonParser, (req, res) => {
    db.execute('SELECT room_id FROM room r WHERE r.room_type = ? AND r.branch_no = (SELECT branch_no FROM branch b WHERE b.county = ?) AND r.room_id NOT IN(SELECT room_id FROM date_room d WHERE ? > d.check_out)',
    [req.body.room_type, req.body.county,req.body.check_in],
    function(err , results, fields){
        if(err){
            res.json({status: 'error', message: err});
            return           
        }
        else{
            var room_id = ""
            room_id = results[Math.floor( Math.random() * results.length )]
            var room_id_final = room_id.room_id
            res.json({status: 'ok' , message: 'success query', room_id_final })
        }
    }
    )
})

// 'INSERT INTO view_user_promotion (user_and_promontion, promotion_id) VALUES (?,?,?)',
// [req.body.user_and_promontion, req.body.booking_time],
// let usernameString = localStorage.getItem('username');
// const usernameJson = JSON.parse(usernameString);
// res.json({status: 'ok',username : usernameJson.username})
app.post('/store_promotion', jasonParser, function (req, res, next) {
    db.execute(
       'SELECT * FROM promotion WHERE promotion_id = ?', // promotion_id same in tb promotion
       [req.body.pro_id],
       function(err, promotion_tbPromotion , fields) {
          if(err){
             res.json({status: 'error', messsage : err})
             return
          }
          if(promotion_tbPromotion.length > 0){ // if there is promotion_id 
             //res.json({status: 'ok'}) //testing and then passing!!
             db.execute(
                'SELECT * FROM promotion WHERE promotion_id = ?', //promotion_id same in view_user_promotion
                [req.body.pro_id],
                function(err,promotion_tbViewUserPromo,fields){
                   if(err){
                      res.json({status: 'error', messsage : err})
                      return
                   }
                   let textString = JSON.stringify(promotion_tbPromotion[0].condition);
                   let ArrayString = textString.split(" ");
                   if(ArrayString[5] > promotion_tbViewUserPromo.length){ // checking rights that can store ? 
                      db.execute(
                         
                      );
                   }else{
                      res.json({status: 'error'})
                   }
                }
             );
             
             
          }else{ 
             res.json({status: 'error'})
          }
 
       }
     );
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