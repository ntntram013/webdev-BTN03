const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongodb = require('mongodb');
const formidable = require('formidable');
const cloudinary = require('cloudinary');
const session = require('express-session');
console.log(require('dotenv').config())

const passport = require('./passport');
const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const storeRouter = require('./routes/store');
const contactRouter = require('./routes/contact');
const cartRouter = require('./routes/cart');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   // body parser
app.use(cookieParser());                                   // cookie parser
app.use(express.static(path.join(__dirname, 'public')));
//Express session
//app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(session({secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/store', storeRouter);
app.use('/contact', contactRouter);
app.use('/cart', cartRouter);
app.use('/user', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
