const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongo = require('mongodb');
const keys = require('./config/keys')
const fetch = require('node-fetch')

var path = require('path');
var cookieParser = require('cookie-parser')
const session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var expressValidator = require('express-validator');

// const categoryRoutes = require('./api/routes/categories');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const barangRoutes = require('./api/routes/barangs');
// const favoriteRoutes = require('./api/routes/favorites');
// const categoryeventRoutes = require('./api/routes/categoryevents');
// const adminRoutes = require('./api/routes/admins');
// const imageRoutes = require('./api/routes/images');


// mongoose.connect('mongodb://127.0.0.1:27017');
// mongoose.connect('mongodb://localhost:27017/eventarich_me');
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});
mongoose.Promise = global.Promise;

const router = express.Router();

var request = require('request');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/AdminLTE-2.4.3/AdminLTE-2.4.3'));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());


//SEMENTARA ADMIN NITIP DISINI

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/');
  }
}

// app.get('/',  (req, res) => {
//   res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/login');
// });

// function get(url) {
//   return new Promise((resolve, reject) => {
//     fetch(url)
//       .then(res => res.json())
//       .then(data => resolve(data))
//       .catch(err => reject(err))
//   })
// }

// app.get('/admin', ensureAuthenticated,(req, res) => {
//       Promise.all([
//         get('http://localhost:3000/admins/orders/'),
//         get('http://localhost:3000/admins/users/'),
//         get('http://localhost:3000/admins/events/'),
//         get('http://localhost:3000/admins/orders/new'),
//         get('http://localhost:3000/admins/events/new'),
//       ]).then(([orders, users, events, neworders, newevents]) =>
//         res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/index',{
//           orders: orders.count,
//           users : users.count,
//           events : events.count,
//           neworders : neworders.count,
//           newevents : newevents.count
//         }))
//         .catch(err => res.send('Ops, something has gone wrong'))
//     });

// app.get('/admin/orders',ensureAuthenticated, (req, res) => {
//     request.get('http://localhost:3000/admins/orders/', function(err, response, body) {
//         if (!err && response.statusCode == 200) {
//             var locals = body ;// console.log(data);
//             var data = JSON.parse(locals);
//             console.log(data);
//             res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/orders', {data: data});
//         }
//     });
// });

// app.get('/admin/orders/new', ensureAuthenticated,(req, res) => {
//     request.get('http://localhost:3000/admins/orders/new', function(err, response, body) {
//         if (!err && response.statusCode == 200) {
//             var locals = body ;// console.log(data);
//             var data = JSON.parse(locals);
//             console.log(data);
//             res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/neworders', {data: data});
//         }
//     });
// });

// app.get('/admin/events', (req, res) => {
//     request.get('http://localhost:3000/admins/events/', function(err, response, body) {
//         if (!err && response.statusCode == 200) {
//             var locals = body ;// console.log(data);
//             var data = JSON.parse(locals);
//             console.log(data);
//             res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/events', {data: data});
//         }
//     });
// });

// app.get('/admin/events/new', ensureAuthenticated,(req, res) => {
//     request.get('http://localhost:3000/admins/events/new', function(err, response, body) {
//         if (!err && response.statusCode == 200) {
//             var locals = body ;// console.log(data);
//             var data = JSON.parse(locals);
//             console.log(data);
//             res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/newevents', {data: data});
//         }
//     });
// });

// app.get('/admin/users',ensureAuthenticated, (req, res) => {
//     request.get('http://localhost:3000/admins/users/', function(err, response, body) {
//         if (!err && response.statusCode == 200) {
//             var locals = body ;// console.log(data);
//             var data = JSON.parse(locals);
//             console.log(data);
//             res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/users', {data: data});
//         }
//     });
// });

// app.get('/admin/users/:id',ensureAuthenticated, (req, res) => {
//     var body = {
//       id : req.params.id
//     };
//     fetch('http://localhost:3000/admins/users/delete', {
//     method: 'POST',
//     body:    JSON.stringify(body),
//     headers: { 'Content-Type': 'application/json' },
// })
//     .then(res => res.json())
//     .then(json => console.log(json));

// res.redirect('/admin/users');
//     });

// app.get('/admin/orders/accept/:id', ensureAuthenticated,(req, res) => {
//     var body = {
//       id : req.params.id
//     };
//     fetch('http://localhost:3000/admins/orders/accept', {
//       method: 'POST',
//       body:    JSON.stringify(body),
//       headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(json => alert(json));
// res.redirect('/admin/orders');
//   });

// app.get('/admin/orders/done/:id',ensureAuthenticated, (req, res) => {
//     var body = {
//       id : req.params.id
//     };
//     fetch('http://localhost:3000/admins/orders/done', {
//       method: 'POST',
//       body:    JSON.stringify(body),
//       headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(json => console.log(json));
// res.redirect('/admin/orders');
//   });

// app.get('/admin/events/accept/:id', (req, res) => {
//     var body = {
//       id : req.params.id
//     };
//     fetch('http://localhost:3000/admins/events/accept', {
//       method: 'POST',
//       body:    JSON.stringify(body),
//       headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(json => alert(json));
// res.redirect('/admin/events');
//   });

// app.get('/admin/events/reject/:id', ensureAuthenticated,(req, res) => {
//     var body = {
//       id : req.params.id
//     };
//     fetch('http://localhost:3000/admins/events/reject', {
//       method: 'POST',
//       body:    JSON.stringify(body),
//       headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(json => console.log(json));
// res.redirect('/admin/events');
//   });




//------------------------------------------------------------------------------------//


// Routes which should handle requests
// app.use('/categories', categoryRoutes); //Middleware
app.use('/orders', orderRoutes); //Middleware
app.use('/barangs', barangRoutes);
app.use('/users', userRoutes); //Middleware
// app.use('/favorites', favoriteRoutes);
// app.use('/categoryevents', categoryeventRoutes);
// app.use('/admins', adminRoutes);
// app.use('/eventimages', imageRoutes);

// app.use('/', admintRoutes);
// app.use('/admin/login');
// app.use('/login');


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});

//BUAT IONIC
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

module.exports = app;
