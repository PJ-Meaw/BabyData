function next_book()
{
    window.location = 'http://127.0.0.1:5500/babydata/Book.html';
}

function next_booklog()
{
    window.location = 'http://127.0.0.1:5500/babydata/BookLog.html';
}

function next_home()
{
    window.location = 'http://127.0.0.1:5500/babydata/Home.html';
}

function next_homelog()
{
    window.location = 'http://127.0.0.1:5500/babydata/HomeLog.html';
}

function next_login()
{
    window.location = 'http://127.0.0.1:5500/babydata/Login.html';
}

function next_detail()
{
    window.location = 'http://127.0.0.1:5500/babydata/Details.html';
}

function next_cartroom()
{
    window.location = 'http://127.0.0.1:5500/babydata/CartRoom.html';
}

function next_activity()
{
    window.location = 'http://127.0.0.1:5500/babydata/Activity.html';
}

function next_activitylog()
{
    window.location = 'http://127.0.0.1:5500/babydata/ActivityLog.html';
}

function next_food()
{
    window.location = 'http://127.0.0.1:5500/babydata/Food.html';
}

function next_foodlog()
{
    window.location = 'http://127.0.0.1:5500/babydata/FoodLog.html';
}

function next_ourroom()
{
    window.location = 'http://127.0.0.1:5500/babydata/OurRoom.html';
}

function next_ourroomlog()
{
    window.location = 'http://127.0.0.1:5500/babydata/OurRoomLog.html';
}

function next_promotion()
{
    window.location = 'http://127.0.0.1:5500/babydata/promotion.html';
}

function next_promotionlog()
{
    window.location = 'http://127.0.0.1:5500/babydata/promotionLog.html';
}

function next_activity()
{
    window.location = 'http://127.0.0.1:5500/babydata/Activity.html';
}

function next_activitylog()
{
    window.location = 'http://127.0.0.1:5500/babydata/ActivityLog.html';
}

function next_food()
{
    window.location = 'http://127.0.0.1:5500/babydata/Food.html';
}

function next_foodlog()
{
    window.location = 'http://127.0.0.1:5500/babydata/FoodLog.html';
}

function after_login()
{
    var pass = document.getElementById("password").value
    var user = document.getElementById("email-address").value
    if (pass=="" || user=="")
    {
        alert("fill your E-mail and password")
    }
    else if(pass=="123"&&user=="123@123")
    {
        window.location = 'http://127.0.0.1:5500/babydata/HomeLog.html';
    }
    else
    {
        alert("E-mail or Password Incorrect!")
    }
}

function after_booking()
{
    var dayin = document.getElementById("dayin").value
    var monthin = document.getElementById("monthin").value
    var yearin = document.getElementById("yearin").value
    var dayout = document.getElementById("dayout").value
    var monthout = document.getElementById("monthout").value
    var yearout = document.getElementById("yearout").value
    var participant = document.getElementById("participant").value
    if(dayin=="select"||monthin=="select"||yearin=="select"||dayout=="select"||monthout=="select"||yearout=="select"||participant=="select")
    {
        alert("plese select all of the box")
    }
    else
    {
        alert("asdasd")
    }

}