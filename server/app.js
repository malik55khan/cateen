var express = require('express');
//var cronJobs = require('./config/cronJobs.js');

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
require('dotenv').config();
var db = require('./config/db.js');
var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000 }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/public/uploads'));
// Routes

require('./modules/user/user.route')(app,express,passport);
require('./modules/menu/menu.route')(app,express,passport);
require('./modules/order/order.route')(app,express,passport);
require('./modules/payment/payment.route')(app,express,passport);
require('./modules/setting/setting.route')(app,express,passport);
require('./modules/notification/notification.route')(app,express,passport);


// require('./modules/admin/admin.route')(app,express,passport);
// require('./modules/cms-page/cms.route')(app,express,passport);
// require('./modules/fileuploader/fileuploader.route')(app,express,passport);
// require('./modules/speciality/speciality.route')(app,express,passport);
// require('./modules/questionnaire/questionnaire.route')(app,express,passport);
// require('./modules/orderkit/orderkit.route')(app,express,passport);
// require('./modules/order/order.route')(app,express,passport);
// require('./modules/stripe/stripe.route')(app,express,passport);
// require('./modules/search/search.route')(app,express,passport);
// require('./modules/appointment/appointment.route')(app,express,passport);
// require('./modules/shared/shared.route')(app,express,passport);

app.use('/assets', express.static(path.join(__dirname, '/dist/adminDist/dist/assets/')));
app.use('/admin', express.static(path.join(__dirname, '/dist/adminDist/dist')));
app.get('/admin', function (req, res) {
  return res.sendFile(path.join(__dirname, '/dist/adminDist/dist/index.html'))
}).get('/admin/*', function (req, res) {
  return res.sendFile(path.join(__dirname, '/dist/adminDist/dist/index.html'))
});

app.use('/assets', express.static(path.join(__dirname, '/dist/specialistDist/dist/assets/')));
app.use('/specialist', express.static(path.join(__dirname, '/dist/specialistDist/dist')));
app.get('/specialist', function (req, res) {
  return res.sendFile(path.join(__dirname, '/dist/specialistDist/dist/index.html'))
}).get('/specialist/*', function (req, res) {
  return res.sendFile(path.join(__dirname, '/dist/specialistDist/dist/index.html'))
})

app.use('/assets', express.static(path.join(__dirname, '/dist/checkisaurus/assets/')));
app.use('/', express.static(path.join(__dirname, '/dist/checkisaurus/')));
app.get('/', function (req, res) {
  return res.sendFile(path.join(__dirname, '/dist/checkisaurus/index.html'))
}).get('/*', function (req, res) {
  return res.sendFile(path.join(__dirname, '/dist/checkisaurus/index.html'))
})
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(cors());
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
