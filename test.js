const { data } = require("jquery");

var num = 0;
var str1 = "BBD";
var str2 = num.toString();

if(str2.length == 1){
    str2 = "00" + str2;
}
else if(str2.length == 2){
    str2 = "0" + str2;
}
var data1 = null;
var date = new Date()
//console.log(str3 = str1+str2);
//console.log(data1);
let String =  "BR-0000001";
var booking_length = 20
var GenBooking_id = "BR-"
for(let i=0; i< 7-booking_length.toString().length ;i++){
    GenBooking_id += "0";
}
Booking_id = GenBooking_id + booking_length.toString()

var date_and_room_length = 10
var Gendateroom_id = "DAR"
for(let i=0; i< 13-date_and_room_length.toString().length ;i++){
    Gendateroom_id += "0";
}
var date_and_room = Gendateroom_id + date_and_room_length.toString()
//console.log(date_and_room)

// find different of 2 date and return results in days
const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));

// Example
var now = new Date();
var dt = new Date(2022,03,20);
//dt.setHours( dt.getHours() + 2 );
//document.write( dt );
//console.log(now)
//console.log(dt)
var con
if(dt < now) con = 1;
else con =0;
//console.log(Math.floor((now - dt)/(24*60*60*1000)));
//console.log(con)

// test split room -> room num
// BB168 -> 68
var room_id = "BB168"
let temp = room_id.split("BB")
let room_with_branch = temp[1]
var room_num = room_with_branch.substring(1); 
//console.log(room_num)


var user_and_promotion_pk = { // for promotion make it global
    room_id: ["BB168","BB178"],
    user_and_promotion: []
}
var test1 = { pro_id: user_and_promotion_pk.pro_id }  
var string = 'havefood'
if(string == 'havefood') console.log("true")
else console.log("false")


now = new Date()
now = now.toString();
console.log(now)