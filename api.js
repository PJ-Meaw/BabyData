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
    db.execute('SELECT promotion_id,user_and_promotion FROM view_user_promotion WHERE username = ? AND status = 1',
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
    db.execute('SELECT room_id FROM room r WHERE r.room_type = ? AND r.branch_no = (SELECT branch_no FROM branch b WHERE b.county = ?) AND r.room_id NOT IN(SELECT room_id FROM date_room d WHERE ? > d.check_out OR ? < d.check_in)',
    [req.body.room_type, req.body.county,req.body.check_in,req.body.check_out],
    function(err , results, fields){
        if(err){
            res.json({status: 'error', message: err});
            return
        }
        else{
            var room_id = results[Math.floor( Math.random() * results.length )]
            var room_id_final = room_id.room_id
            res.json({status: 'ok' , message: 'success query', room_id_final, room_empty: results.length})
        }
    }
    )
})

app.post('/show_room', jasonParser, (req, res) => {
    db.execute('SELECT room_id,date_and_room FROM date_room d WHERE d.booking_id IN(SELECT booking_id FROM booking b WHERE username = ?) AND check_in < ? AND check_out > ?',
    [req.body.username, req.body.now, req.body.now],
    function(err , results, fields){
        if(err){
            res.json({status: 'error', message: err});
            return
        }
        else{
            var room_id = [] 
            for(let i =0; i< results.length; i++){
                room_id.push(results[i].room_id);
            }
            var date_and_room = []
            for(let i = 0; i< results.length; i++){
                date_and_room.push(results[i].date_and_room)
            }
            res.json({status: 'ok' , message: 'success query', room_id, date_and_room})
        }
    }
    )
})


app.post('/inserted_food', jasonParser, (req, res) => {
    db.query('SELECT reserve_id FROM food_reserving',
    function(err, results, fields) {
        if(err){
            console.log(err);
        }
        else{
            var fr_length = results.length+1;
            // generate reserve_id
            var Genreserve_id = "FR"
            for(let i=0; i< 8-fr_length.toString().length ;i++){
                Genreserve_id += "0";
            }
            var reserve_id = Genreserve_id + fr_length.toString()
            db.execute('INSERT INTO food_reserving VALUES (?, ?, ?, ?, ?, ?, ?)',
            [reserve_id, req.body.food_id, req.body.user_and_promotion, req.body.date_and_room, req.body.total, req.body.total_discount, req.body.quantity],
            function(err , results2, fields){
                if(err){
                    res.json({status: 'error', message: err});
                    return
                }
                else{
                    res.json({status: 'ok' , message: 'success inserted'})
                }
            });
        }
    });
})

app.post('/insert_book', jasonParser, (req, res) => {
    db.query(
        'SELECT booking_id FROM booking',
        function(err, results, fields) {
            if(err){
                console.log(err)
            }
            else{
                var booking_length = results.length +1;
                db.query(
                    'SELECT date_and_room FROM date_room',
                    function(err2, results2, fields) {
                        if(err2){
                            console.log(err2)
                        }
                        else{
                            var date_and_room_length = results2.length +1;
                            // generate booking_id
                            var GenBooking_id = "BR-"
                            for(let i=0; i< 7-booking_length.toString().length ;i++){
                                GenBooking_id += "0";
                            }
                            var Booking_id = GenBooking_id + booking_length.toString()

                            // generate date_and_room
                            var Gendateroom_id = "DAR"
                            for(let i=0; i< 13-date_and_room_length.toString().length ;i++){
                                Gendateroom_id += "0";
                            }
                            var date_and_room = Gendateroom_id + date_and_room_length.toString()
                            db.execute('INSERT INTO booking VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [Booking_id, req.body.username, req.body.booking_time, req.body.total, req.body.total_discount, req.body.user_and_promotion, req.body.participant],
                            function(err , results, fields){
                                if(err){
                                    res.json({status: 'error', message: err});
                                    return
                                }
                                else{
                                    db.execute('INSERT INTO date_room VALUES (?, ?, ?, ?, ?, ?)',
                                    [date_and_room, req.body.check_in, req.body.check_out, req.body.room_id, Booking_id, req.body.addbed],
                                    function(err , results, fields){
                                        if(err){
                                            res.json({status: 'error', message: err});
                                            return
                                        }
                                        else{
                                            if(req.body.user_and_promotion != null) {
                                                db.execute('UPDATE view_user_promotion SET status = 0 WHERE user_and_promotion = ?',
                                                [req.body.user_and_promotion],
                                                function(err , results, fields){
                                                    if(err){
                                                        res.json({status: 'error', message: err});
                                                        return
                                                    }
                                                    else{
                                                        res.json({status: 'ok', message: err});
                                                    }
                                                });
                                            }
                                            else{
                                                res.json({status: 'ok', message: err});
                                            }
                                        }
                                    })
                                } 
                            });
                        }
                    });
                } 
        });
});

// 'INSERT INTO view_user_promotion (user_and_promontion, promotion_id) VALUES (?,?,?)',
// [req.body.user_and_promontion, req.body.booking_time],
// let usernameString = localStorage.getItem('username');
// const usernameJson = JSON.parse(usernameString);
// res.json({status: 'ok',username : usernameJson.username})

app.post('/store_promotion', jasonParser, function (req, res, next) {
    db.execute(
       'SELECT * FROM promotion WHERE promotion_id = ?', // promotion_id same in tb promotion
       [req.body.pro_id],
       function (err, promotion_tbPromotion, fields) {
          if (err) {
             res.json({ status: 'error', messsage: err })
             return
          }
          if (promotion_tbPromotion.length > 0) { // if there is promotion_id 
             //res.json({status: 'ok'}) //testing and then passing!!
             db.execute(
                'SELECT * FROM view_user_promotion WHERE username = ? AND promotion_id = ?', //promotion_id of user which having in view_user_promotion
                [req.body.username, req.body.pro_id],
                function (err, promotion_tbViewUserPromo, fields) {
                   if (err) {
                      res.json({ status: 'error', messsage: err })
                      return
                   }
                   let textString = JSON.stringify(promotion_tbPromotion[0].condition);
                   let ArrayString = textString.split(" ");
                   if (ArrayString[5] > promotion_tbViewUserPromo.length) { // checking rights that can store ? 
                      db.execute(
                         'SELECT user_and_promotion FROM view_user_promotion ORDER BY user_and_promotion DESC',
                         function (err, Full_promotion_tbViewUserPromo, fields) {
                            if (err) {
                               res.json({ status: 'error', messsage: err })
                               return
                            }
                            //let lastIndex = Full_promotion_tbViewUserPromo.length;
                            let User_and_Promontion = Full_promotion_tbViewUserPromo[0].user_and_promotion; //index 0 = higtest value
                            const ArraySplitNumSring = User_and_Promontion.split("P");
                            let NumPromotion = parseInt(ArraySplitNumSring[1]);
                            NumPromotion ++; // Add 1 for new promotion or generate
                            let GenPromotion = "";
                            for (let i = 0; i < 13 - NumPromotion.toString().length; i++) { // Add 0 until unit of 
                               GenPromotion += "0";
                            }
                            GenPromotion += NumPromotion;
                            GenPromotion = "UAP" + GenPromotion;
                            db.execute(
                               'INSERT INTO view_user_promotion (user_and_promotion, promotion_id, username) VALUES (?,?,?)',
                               [GenPromotion, req.body.pro_id, req.body.username],
                               function (err, result, fields) {
                                  if (err) {
                                     res.json({ status: 'error', messsage: err })
                                     return
                                  }
                                  res.json({ status: 'success'})
                               }
                            );
                         }
                      );
                   } else {
                      res.json({ status: 'error', message: "full rights" })
                   }
                }
             );
          } else {
             res.json({ status: 'error' })
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