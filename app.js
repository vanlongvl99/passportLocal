var express = require('express');
var session = require('express-session');
var expressLayOut = require('express-ejs-layouts');
var mysql = require('mysql');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');

var bodyparser = require('body-parser');

require('./config/passport')(passport);

app.use(logger('dev'));

//get input of form
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(cookieParser());



// ejs
app.use(expressLayOut);
app.set('view engine','ejs');


app.use(session({
    secret: 'NguyenVanLong',
    resave: true,
    saveUninitialized: true
} )); // session secret

//passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes
require('./routes/users')(app, passport)

var port = process.env.port || 5001 ;

app.listen(port, console.log("server started on port "));