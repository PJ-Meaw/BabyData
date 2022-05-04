var db = require('./connectdb');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
const e = require('express');

var jasonParser = bodyParser.json();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// {username: value , password: value}

app.get('/analyzeactivity', jasonParser, (req,res) => {
    db.query('SELECT  BRANCH,MONTH,YEAR,ACTNAME,SUM(SUMDAY) AS TOTALMONTH,MAX(SUMDAY) AS MAXPERDAY FROM (SELECT BRANCH,MONTH,YEAR,DAY,ACTNAME,SUM(part)AS SUMDAY FROM (SELECT SUM(b.participant) AS part,EXTRACT(DAY FROM v.check_in) AS DAY,EXTRACT(MONTH FROM v.check_in) AS MONTH,EXTRACT(YEAR FROM v.check_in) AS YEAR , BRANCH,ACTNAME FROM booking_activity b,view_date_activity v ,(SELECT h.branch_name AS BRANCH,t.activity_name AS ACTNAME,t.activity_no AS ACTIVITY FROM branch h, activity t WHERE h.branch_no=t.branch_no) AS ACT WHERE b.booking_activity_id=v.booking_activity_id AND ACTIVITY=v.activity_no GROUP BY v.activity_no,EXTRACT(MONTH FROM v.check_in) , EXTRACT(DAY FROM v.check_in) )AS sumpartbranch GROUP BY BRANCH,ACTNAME,YEAR,MONTH,DAY) AS summm GROUP BY BRANCH,ACTNAME,YEAR,MONTH;',
    function(err, results, fields) {
        if(err){
            console.log(err);
        }
        else{

            var branch = [] 
            var month = [] 
            var year = [] 
            var activity_name = [] 
            var totalmonth = [] 
            var maxperday = [] 
            var avgperday = [] 
            for(let i =0; i< results.length; i++){
                branch.push(results[i].BRANCH);
                month.push(results[i].MONTH);
                year.push(results[i].YEAR);
                activity_name.push(results[i].ACTNAME);
                totalmonth.push(results[i].TOTALMONTH);
                maxperday.push(results[i].MAXPERDAY);
                if(results[i].YEAR % 4 == 0){
                    if(results[i].MONTH ==2){
                        avgperday.push(results[i].TOTALMONTH/29)
                    }else if(results[i].MONTH == 1 ||results[i].MONTH == 3 ||results[i].MONTH ==5||results[i].MONTH ==7||results[i].MONTH ==8||results[i].MONTH ==10||results[i].MONTH ==12)
                    {
                        avgperday.push(results[i].TOTALMONTH/31)
                    }else{
                        avgperday.push(results[i].TOTALMONTH/30)
                    }
                }else{
                    if(results[i].MONTH ==2){
                        avgperday.push(results[i].TOTALMONTH/28)
                    }else if(results[i].MONTH == 1 ||results[i].MONTH == 3 ||results[i].MONTH ==5||results[i].MONTH ==7||results[i].MONTH ==8||results[i].MONTH ==10||results[i].MONTH ==12)
                    {
                        avgperday.push(results[i].TOTALMONTH/31)
                    }else{
                        avgperday.push(results[i].TOTALMONTH/30)
                    }

                }
            }

            res.json({branch,month,year,activity_name,totalmonth,maxperday,avgperday})

        }
    });
})



app.get('/analyzebooking', jasonParser, (req,res) => {
    db.query('SELECT EXTRACT(MONTH FROM check_in)AS MONTH,EXTRACT(YEAR FROM check_in)AS YEAR,BRANCH ,SUM(k.total) AS TOTAL,SUM(k.total_discount) AS TOTALDISCOUNT,COUNT(k.booking_id) AS NUM FROM (SELECT r.room_id AS ROOM,c.branch_name AS BRANCH FROM room r, branch c WHERE r.branch_no=c.branch_no) AS BROOM , date_room d,booking k WHERE d.room_id=ROOM AND k.booking_id=d.booking_id GROUP BY YEAR,MONTH,BRANCH;',
    function(err, results, fields) {
        if(err){
            console.log(err);
        }
        else{
            var j,tt,ttdc,cnum
            var branch = [] 
            var month = [] 
            var year = [] 
            var total = [] 
            var totaldiscount = [] 
            var num = [] 
            var b1total = [] 
            var b2total = [] 
            var b1td = [] 
            var b2td = [] 
            var b1num = [] 
            var b2num = [] 
            for(let i =0; i< results.length; i+=2){
                tt=0;
                ttdc=0;
                cnum=0;
                branch.push(results[i].BRANCH);
                month.push(results[i].MONTH);
                year.push(results[i].YEAR);
                b1total.push(results[i].TOTAL);
                tt=tt+Number(results[i].TOTAL);
                b1td.push(results[i].TOTALDISCOUNT);
                ttdc=ttdc+Number(results[i].TOTALDISCOUNT);
                b1num.push(results[i].NUM);
                cnum=cnum+Number(results[i].NUM);
                j=i+1;
                b2total.push(results[j].TOTAL);
                tt=tt+Number(results[j].TOTAL);
                b2td.push(results[j].TOTALDISCOUNT);
                ttdc=ttdc+Number(results[j].TOTALDISCOUNT);
                b2num.push(results[j].NUM);
                cnum=cnum+Number(results[j].NUM);
                total.push(Number(tt));
                totaldiscount.push(Number(ttdc));
                num.push(Number(cnum));
            }
            res.json({year,month,num,b1num,b2num,total,b1total,b2total,totaldiscount,b1td,b2td})

        }
    });
})



app.get('/cleaningstaff2', jasonParser, (req,res) => {
    db.query('SELECT DAY,MONTH,YEAR,BRANCH,COUNT(ROOM_DATE_ID) AS COUNT_ROOM FROM (SELECT DAY,MONTH,YEAR,ROOM_DATE_ID,BRANCH FROM (SELECT EXTRACT(DAY FROM check_out) AS DAY, EXTRACT(MONTH FROM check_out) AS MONTH, EXTRACT(YEAR FROM check_out) AS YEAR,room_id AS ROOM_DATE_ID FROM date_room)AS DATER,(SELECT EXTRACT(DAY FROM NOW()) AS DATEDAY, EXTRACT(MONTH FROM NOW()) AS DATEMONTH, EXTRACT(YEAR FROM NOW()) AS DATEYEAR) AS DATEE, (SELECT c.county AS BRANCH,r.room_id AS ROOM_ROOM FROM room r, branch c WHERE r.branch_no=c.branch_no)AS BRANCHNAME WHERE DAY=DATEDAY AND MONTH=DATEMONTH AND YEAR=DATEYEAR AND ROOM_ROOM=ROOM_DATE_ID)AS ROM GROUP BY BRANCH;',
    function(err, results, fields) {
        if(err){
            console.log(err);
        }
        else{
            
            var countroom=[]        

            for(let i =0; i< results.length; i++){
                countroom.push(results[i].COUNT_ROOM);                 
            }

            db.query('SELECT CT,COUNT(CT) AS COUNT_EM FROM (SELECT e.first_name,e.last_name,c.county AS CT FROM employee e,branch c WHERE e.position="Housekeeper" AND e.branch_no=c.branch_no) AS Em GROUP BY CT;',
            function(err, results, fields) {
                if(err){
                    console.log(err);
                }
                else{
                    var countem=[]
                    var ct=[]
                    for(let i =0; i< results.length; i++){

                        ct.push(results[i].CT);
                        countem.push(Number(results[i].COUNT_EM));
                                  
                    }

                    db.query('SELECT DAY,MONTH,YEAR,ROOM_DATE_ID,BRANCH FROM (SELECT EXTRACT(DAY FROM check_out) AS DAY, EXTRACT(MONTH FROM check_out) AS MONTH, EXTRACT(YEAR FROM check_out) AS YEAR,room_id AS ROOM_DATE_ID FROM date_room)AS DATER, (SELECT EXTRACT(DAY FROM NOW()) AS DATEDAY, EXTRACT(MONTH FROM NOW()) AS DATEMONTH, EXTRACT(YEAR FROM NOW()) AS DATEYEAR) AS DATEE, (SELECT c.county AS BRANCH,r.room_id AS ROOM_ROOM FROM room r, branch c WHERE r.branch_no=c.branch_no)AS BRANCHNAME WHERE DAY=DATEDAY AND MONTH=DATEMONTH AND YEAR=DATEYEAR AND ROOM_ROOM=ROOM_DATE_ID ORDER BY BRANCH,ROOM_DATE_ID;',
                function(err, results, fields) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        var day=[]
                        var month=[]
                        var year=[]
                        var room=[]
                        var branch=[]

                        for(let i =0; i< results.length; i++){
                            day.push(results[i].DAY);
                            month.push(results[i].MONTH);
                            year.push(results[i].YEAR);    
                            branch.push(results[i].BRANCH);  
                            room.push(results[i].ROOM_DATE_ID);
                        }

                        db.query('SELECT e.first_name,e.last_name,c.county FROM employee e,branch c WHERE e.position="Housekeeper" AND e.branch_no=c.branch_no;',
                    function(err, results, fields) {
                        if(err){
                            console.log(err);
                        }
                        else{

                            var emf=[]
                            var eml=[]
                            var branchem=[]

                            for(let i =0; i< results.length; i++){
                                emf.push(results[i].first_name);
                                eml.push(results[i].last_name);
                                branchem.push(results[i].county);  
                            
                                
                            }
                            res.json({countroom,countem,day,month,year,branch,room,emf,eml})                   
                        }
                        });

                    }
                    });
                    
                }
                });
                    
                
                    


                            

        }
    });
})

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
            res.json({status: 'ok', message: 'Loging-in Success!!.', username: req.body.username , role: results[0].role}); 
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
app.post('/have_food', jasonParser, (req, res) => {
    db.execute('SELECT branch_no FROM room WHERE room_id = ?',
    [req.body.room_id],
    function(err , results, fields){
        if(err){
            res.json({status: 'error', message: err});
            return           
        }
        else{
            var branch_no = results[0].branch_no;
            db.execute('SELECT food_id FROM food WHERE branch_no = ? AND food_name = ? AND status = 1',
            [branch_no, req.body.food_name],
            function(err , food_id, fields){
                if(err) console.log(err);
                else {
                    if(food_id.length == 0 ){
                        res.json({status: 'no-food', message: err});
                    }
                    else {
                        res.json({status: 'have-food', message: err});
                    }
                }
            });
        }
        
    })
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
            var user_and_promotion;
            // generate reserve_id
            var Genreserve_id = "FR"
            for(let i=0; i< 8-fr_length.toString().length ;i++){
                Genreserve_id += "0";
            }
            var reserve_id = Genreserve_id + fr_length.toString()
            if(req.body.user_and_promotion == null){
                db.execute('INSERT INTO food_reserving VALUES (?, ?, ?, ?, ?, ?, ?)',
                [reserve_id, req.body.food_id, null, req.body.date_and_room, req.body.total, req.body.total_discount, req.body.quantity],
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
            else{
                db.execute('INSERT INTO food_reserving VALUES (?, ?, ?, ?, ?, ?, ?)',
                [reserve_id, req.body.food_id, req.body.user_and_promotion, req.body.date_and_room, req.body.total, req.body.total_discount, req.body.quantity],
                function(err , results3, fields){
                    if(err){
                        res.json({status: 'error', message: err});
                        return
                    }
                    else{
                        db.execute('UPDATE view_user_promotion SET status = 0 WHERE user_and_promotion = ?',
                        [req.body.user_and_promotion],
                        function(err, results4,fields){
                            if(err) {
                                console.log(err)
                            }
                            else {
                                res.json({status: 'ok' , message: 'success inserted'})
                            }
                        }
                        );
                    }
                });
            }
        }
    });
})
 /* get data = {
     username: u001
     now: date / timestamp
 }
 */
 app.post('/cart_room_getbookingid', jasonParser, (req,res) => {
    db.execute('SELECT b.booking_id,b.user_and_promotion,participant,total,total_discount,d.check_in,d.check_out,d.room_id,r.room_type, r.room_image, r.branch_no, br.branch_name FROM booking b, date_room d, room r, branch br WHERE b.username = ? AND ? < d.check_in AND b.booking_id = d.booking_id AND d.room_id = r.room_id AND r.branch_no = br.branch_no GROUP BY b.booking_id,d.room_id;',
    [req.body.username,req.body.now],
    function(err, result1, fields) {
       if(err) console.log(err)
       else {
           res.json({result1})
       }
    });
});
app.post('/delete_booking', jasonParser, (req,res) => {
    db.execute('DELETE FROM date_room WHERE booking_id = ?',
    [req.body.booking_id],
    function(err, result1, fields){
        if(err) console.log(err)
        else {
            db.execute('DELETE FROM booking WHERE booking_id = ? ',
            [req.body.booking_id],
            function(err, result2, fields){
                if(err) console.log(err)
                else {
                    if(req.body.user_and_promotion != null){
                        db.execute('UPDATE view_user_promotion SET status = 1 WHERE user_and_promotion = ?',
                        [req.body.user_and_promotion],
                        function(err, result3,fields){
                            if(err) console.log(err)
                            else {
                                res.json({status: 'ok'})
                            }
                        })
                    }
                }
            });
        }
    });
});

app.get('/get_client_history',jasonParser, (req,res) => {
    now = new Date()
    db.query('CREATE VIEW booking_count AS SELECT u.username, u.first_name, u.last_name, u.sex, u.phone, FLOOR((SELECT datediff((SELECT NOW()), date_of_birth))/365) As Age, u.email, COUNT(b.booking_id) As BookCount FROM user u, booking b WHERE u.username = b.username GROUP BY u.username;',
    function(err, result1, fields){
        if(err) console.log(err)
        else {
            db.query('CREATE VIEW activity_count AS SELECT u.username, COUNT(ba.booking_activity_id) As ActivityCount FROM user u,booking_activity ba, date_room d, booking b WHERE ba.date_and_room = d.date_and_room AND d.booking_id = b.booking_id AND b.username = u.username GROUP BY u.username;',
            function(err, result2, fields){
                if(err) console.log(err)
                else{
                    db.query('CREATE VIEW food_count AS SELECT u.username, COUNT(fr.reserve_id) As FoodReserveCount FROM user u, food_reserving fr, date_room d, booking b WHERE fr.date_and_room = d.date_and_room AND d.booking_id = b.booking_id AND b.username = u.username GROUP BY u.username;',
                    function(err, result3,fields){
                        if(err) console.log(err)
                        else {
                            db.query('CREATE VIEW room_type_count AS (SELECT u.username, MAX(r.room_type) As RoomType FROM user u, booking b, date_room d, room r WHERE u.username = b.username AND b.booking_id = d.booking_id AND d.room_id = r.room_id GROUP BY u.username,d.date_and_room);',
                            function(err, result4,fields){
                                if(err) console.log(err)
                                else{
                                    db.query('SELECT b.*, a.ActivityCount, f.FoodReserveCount, RoomType,  CountType FROM booking_count b  LEFT JOIN activity_count a ON b.username = a.username LEFT JOIN food_count f ON b.username = f.username LEFT JOIN (SELECT username, COUNT(RoomType) CountType,RoomType FROM room_type_count GROUP BY username,RoomType) rtc ON b.username = rtc.username;',
                                    function(err, result5, fields){
                                        if(err) console.log(err)
                                        else {
                                            res.json({result5})
                                            db.query('DROP VIEW IF EXISTS activity_count,booking_count,food_count,room_type_count;',
                                            function(err,result6, fields){
                                                if(err) console.log(err)
                                                else {
                                                    console.log("Successful Drop View Table!!.")
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        
    });
});

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
                            if(req.body.user_and_promotion != null) { // if user use promotion
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
                            else { // if not use promotion
                                db.execute('INSERT INTO booking VALUES (?, ?, ?, ?, ?, ?, ?)',
                                [Booking_id, req.body.username, req.body.booking_time, req.body.total, req.body.total_discount, null, req.body.participant],
                                function(err , results6, fields){
                                    if(err){
                                        res.json({status: 'error', message: err});
                                        return
                                    }
                                    else{
                                        res.json({status: 'ok', message: err});
                                    } 
                                }); 
                            }
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
                                  db.execute(
                                    'UPDATE promotion SET amount = amount -1 WHERE promotion_id = ?',
                                    [req.body.pro_id],
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

 app.post('/book_activity', jasonParser, function (req, res, next) { //insert data to Table booking_activity & view_date_activity
   db.execute(
      'SELECT booking_activity_id FROM booking_activity ORDER BY booking_activity_id DESC', // calling booking_activity_id for Gen value
      function (err, Order_booking_activity_id, fields) {
         if (err) {
            res.json({ status: 'error', messsage: err })
            return
         }
         let Last_Value = Order_booking_activity_id[0].booking_activity_id;
         const ArraySplitNumSring = Last_Value.split("A");
         let NumBook_activity = parseInt(ArraySplitNumSring[1]);
         NumBook_activity ++; // Add 1 for new Book_activity_id or generate
         let Gen_ID_Book_activity = "";
         for (let i = 0; i < 4 - NumBook_activity.toString().length; i++) { // Add 0 until unit of 
         Gen_ID_Book_activity += "0";
         }
         Gen_ID_Book_activity += NumBook_activity;
         Gen_ID_Book_activity = "BA" + Gen_ID_Book_activity;
         console.log(Gen_ID_Book_activity)
         
         var today = new Date();
         var TimeNow = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " 
         + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
         
         
         db.execute(
            // "get booking_id" and "date_and_room" and "room_id" period booking Which booking_id don't repeat 
            'SELECT date_and_room, booking_id, room_id FROM date_room d WHERE d.booking_id IN(SELECT booking_id FROM booking b WHERE username = ?) AND check_in < ? AND check_out > ? ORDER BY date_and_room DESC', // calling date_and_room for insert to booking activity
            [req.body.username,TimeNow,TimeNow],
            function (err, result_date_and_room, fields) {
               if (err) {
                  res.json({ status: 'error', messsage: err })
                  return
               }
               var ValueOfDate_and_Room = result_date_and_room[0].date_and_room; // !!!!!!! "let"

               db.execute(
                  'SELECT participant FROM booking WHERE booking_id = ?', // select participant from TB booking for using limit value from form  
                  [result_date_and_room[0].booking_id],
                  function (err,results_participant, fields) {
                     if (err) {
                        res.json({ status: 'error', messsage: err })
                        return
                     }

                     db.execute(
                       'SELECT * FROM view_date_activity WHERE booking_activity_id IN (SELECT booking_activity_id FROM booking_activity WHERE date_and_room = ?)', //For get check_in, check_out are condition booking 
                       [result_date_and_room[0].date_and_room],
                       function (err,results_view_date_acticity, fields) {
                          if (err) {
                                res.json({ status: 'error', messsage: err })
                           return
                          }
                          
                          db.execute(
                             'SELECT activity_no FROM activity WHERE branch_no IN (SELECT branch_no FROM room WHERE room_id = ?)', //For get activity_no then calculate
                             [result_date_and_room[0].room_id],
                             function (err,result_activity, fields) {
                                if (err) {
                                      res.json({ status: 'error', messsage: err })
                                 return
                                }

                                db.execute(
                                 'SELECT discount FROM promotion WHERE promotion_id IN (SELECT promotion_id FROM view_user_promotion WHERE user_and_promotion = ?)', //For get discount of promotion
                                 [req.body.user_and_promotion],
                                 function (err,result_discount, fields) {
                                    if (err) {
                                          res.json({ status: 'error', messsage: err })
                                     return
                                    }

                                    console.log(result_discount[0].discount)

                                    total_discount = req.body.total * (result_discount[0].discount) /100
                                
                                    for(let i=0; i< result_activity.length;i++){
                                          var name = result_activity[i].activity_no.split("0")
                                          if(req.body.name_activity == name[0]){
                                             var actua_name_activity = result_activity[i].activity_no;   
                                          }
                                    }


                                    if(results_participant[0].participant < req.body.participant) //condition 1
                                       res.json({status: 'error', message: 'over participant'})
                                    var TextDate = new Date(TimeNow); //Type date of Timestamp

                                    //timecompare.setHours( timecompare.getHours() + 7 );
                                    /* Part User */
                                    var Check_in_user = new Date(req.body.check_in);
                                    var Check_in_user_time_demo = Check_in_user.toLocaleTimeString(); // 21:00:00
                                    var Check_in_user_time_split = Check_in_user_time_demo.split(":"); 
                                    var Check_in_user_time = Check_in_user_time_split[0]; // Number value Ex. 20 21

                                    var Check_out_user = new Date(req.body.check_out); 
                                    var Check_out_user_time_demo = Check_out_user.toLocaleTimeString(); // 21:00:00
                                    var Check_out_user_time_split = Check_out_user_time_demo.split(":"); 
                                    var Check_out_user_time = Check_out_user_time_split[0]; // Number value Ex. 20 21

                                    //   if(Check_in_user.getTime() < TextDate.getTime()) // condition 2 
                                    //       res.json({status: 'error', message: 'booking late'})

                                    var x = 0; // x checking period time booking overlap
                                    for(let i=0 ;i< results_view_date_acticity.length;i++){
                                       var Check_in_database = results_view_date_acticity[i].check_in
                                       var Check_in_database_date = Check_in_database.toLocaleDateString(); // 29/4/2565
                                       var Check_in_database_time_demo = Check_in_database.toLocaleTimeString(); // 21:00:00
                                       var Check_in_database_time_split = Check_in_database_time_demo.split(":"); 
                                       var Check_in_database_time = Check_in_database_time_split[0]; // Number value Ex. 20 21

                                       var Check_out_database = results_view_date_acticity[i].check_out
                                       //var Check_out_database_date = Check_out_database.toLocaleDateString();
                                       var Check_out_database_time_demo = Check_out_database.toLocaleTimeString();
                                       var Check_out_database_time_split = Check_out_database_time_demo.split(":"); 
                                       var Check_out_database_time = Check_out_database_time_split[0]; // Number value Ex. 20 21
                                       
                                       /* --------------------------   */

                                       if(TextDate.toLocaleDateString() == Check_in_database_date){ // condition since each value is hour So date must be equal date
                                          /* Part database several row*/
                                          if((Check_in_user_time >= Check_in_database_time) && ( Check_out_user_time <= Check_out_database_time)){
                                             x = 1; // Ex. 7-10 ->  7-10 : True
                                          }else if((Check_in_database_time >= Check_in_user_time) && (Check_out_database_time <= Check_out_user_time)) {
                                             x = 1; // Ex. 7-10 ->  6-10 : True , 7-11 : True
                                          }else if((Check_in_user_time < Check_in_database_time) && ( Check_in_database_time < Check_out_user_time) && (res.body.check_out < Check_out_database_time)){
                                             x = 1; // Ex. 7-9 ->  6-8 : True 
                                          }else if((Check_out_user_time > Check_out_database_time) && ( Check_out_database_time > Check_in_user_time) && (res.body.check_in > Check_in_database_time)){
                                             x = 1;  // Ex. 7-9 ->  8-10 : True
                                          }
                                       }
                                    }
                                    
                                    if(x) //condition 3
                                          return res.json({status: 'error', message: 'time overlap'})


                                    if(req.body.check_in === req.body.check_out) // condition 4
                                       res.json({status: 'error', message: 'check_in = check_out'})

                                    db.execute(
                                    'INSERT INTO booking_activity (booking_activity_id, date_and_room, participant, booked_at, user_and_promotion, total, total_discount) VALUES (?,?,?,?,?,?,?)',
                                    [Gen_ID_Book_activity ,ValueOfDate_and_Room, req.body.participant, TimeNow, req.body.user_and_promotion, req.body.total, total_discount],
                                    function (err, result, fields) { //
                                       if (err) {
                                          res.json({ status: 'error', messsage: err })
                                             return
                                       }
                                       db.execute(
                                          'SELECT no_date_activity FROM view_date_activity ORDER BY no_date_activity DESC',
                                          function (err, no_date_activity_Order, fields) {
                                             if (err) {
                                                res.json({ status: 'error', messsage: err })
                                                   return
                                             }
                                             
                                             let Store = no_date_activity_Order[0].no_date_activity
                                             const NumSring = Store.split("-");
                                             let Num_no_date = parseInt(NumSring[1]);
                                             Num_no_date ++; // Add 1 for new Book_activity_id or generate
                                             let Gen_no_date_activity = "";
                                             for (let i = 0; i < 12 - Num_no_date.toString().length; i++) { // Add 0 until unit of 
                                             Gen_no_date_activity += "0";
                                             }
                                             Gen_no_date_activity += Num_no_date;
                                             Gen_no_date_activity = "VDA-" + Gen_no_date_activity;
                                             db.execute(
                                                'INSERT INTO view_date_activity (no_date_activity, check_in, check_out, activity_no, booking_activity_id) VALUES (?,?,?,?,?)',
                                                [Gen_no_date_activity, req.body.check_in, req.body.check_out,actua_name_activity ,results_view_date_acticity[0].booking_activity_id ],
                                                function (err, result, fields) {
                                                   if (err) {
                                                      res.json({ status: 'error', messsage: err })
                                                         return
                                                   }
                                                   res.json({ status: 'success', messsage: err, results_view_date_acticity}) 
                                                }
                                             );
                                          }
                                          );
                                    }
                                    );
                                 }
                                );   
                             }
                           );
                       }
                     );
                     
                  }
               );  
            }
         );
      }
   );
})


app.get('/home', jasonParser, (req, res) => {
    db.execute('')
})
app.get('/home', jasonParser, (req, res) => {
    db.execute('')
})

/*
app.listen(8090, function() {
    console.log('Server is Running on port 8090...')
})
*/

app.listen(3333, function() {
    console.log('Server is Running on port 3333...')
})
