const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
const checkAuth = require('../middleware/checkauth');
const Order = require('../models/order');
// const Category = require('../models/category');
const User = require('../models/user');
const Event = require('../models/event');
const Image = require('../models/image');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//=======================================================//
//login
passport.use(new LocalStrategy(
    function (email, password, done) {
        User.getUserByEmail(email, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/', failureFlash: true }),
    function (req, res) {
        res.redirect('/admin');
    });

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/');
});

// router.post('/login', (req, res, next) => {
//     User.find({ email: req.body.email })
//         .exec()
//         .then(user => {
//             if(user.length < 1) {
//                 return res.status(401).json({
//                     message: 'Auth failed'
//                 });
//             }
//             bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//                 if(err) {
//                     return res.status(401).json({
//                         message: 'Auth failed'
//                     });
//                 }
//                 if(result) {
//                     const token = jwt.sign({
//                         email: user[0].email,
//                         userId: user[0]._id
//                     },
//                     "bismillah"
//                 );
//                     return res.redirect('/admin')
//                     //     res.status(200).json({
//                     //     message: 'Auth successful',
//                     //     token: token,
//                     //     userId : user[0]._id
//                     // });
//                 }
//                 res.status(401).json({
//                     message: 'Auth failed'
//                 });
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });




//-------------- ORDERS --------------//

//Get
router.get('/orders', (req, res, next) => {
    Order.find()
        .populate('category', 'name')
        .populate('userId', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        category: doc.category,
                        date: doc.date,
                        date_created: doc.date_created,
                        budget: doc.budget,
                        address: doc.address,
                        description: doc.description,
                        status: doc.status,
                        userId: doc.userId,
                        // request: {
                        //     type: "GET",
                        //     url: 'http://localhost:3000/admins/orders/' + doc._id
                        // }
                    }
                })
            });
            // res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/events');
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/orders/new', (req, res, next) => {
    Order.find({status : "Waiting"})
        .populate('category', 'name')
        .populate('userId', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                neworders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        category: doc.category,
                        date: doc.date,
                        date_created: doc.date_created,
                        budget: doc.budget,
                        address: doc.address,
                        description: doc.description,
                        status: doc.status,
                        userId: doc.userId,
                        // request: {
                        //     type: "GET",
                        //     url: 'http://localhost:3000/admins/orders/' + doc._id
                        // }
                    }
                })
            });
            // res.render('AdminLTE-2.4.3/AdminLTE-2.4.3/events');
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


//Status

//Accepted
router.post('/orders/accept/', (req, res, next) => {
    const id = req.body.id;
    Order.update({ _id: id }, { $set: {status : "Proccessed"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Accepted",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Done
router.post('/orders/done/',  (req, res, next) => {
    const id = req.body.id;
    Order.update({ _id: id }, { $set: {status : "Done"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Finised",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//-------------- EVENTS --------------//

//GET EVENTS
router.get('/events', (req, res, next) => {
    Image.find()
        .populate('eventId', 'title date_create date_event description city status')
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs.map(doc => {
                    return {
                        id: doc._id,
                        event_image_path: doc.event_image_path,
                        title : doc.title,
                        date_create : doc.date_create,
                        date_event: doc.date_event,
                        description:doc.description,
                        city:doc.city,
                        categoryevent:doc.categoryevent,
                        userId: doc.userId,
                        eventId: doc.eventId,
                        status: doc.status,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/images/" + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/events/new', (req, res, next) => {
    Image.find({status: "waiting admin's confirmation.."})
        .populate('eventId', 'title date_create date_event description city status')
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                newevents: docs.map(doc => {
                    return {
                        id: doc._id,
                        event_image_path: doc.event_image_path,
                        title : doc.title,
                        date_create : doc.date_create,
                        date_event: doc.date_event,
                        description:doc.description,
                        city:doc.city,
                        categoryevent:doc.categoryevent,
                        userId: doc.userId,
                        eventId: doc.eventId,
                        status: doc.status,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/images/" + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//status

//Accepted
router.post('/events/accept/', (req, res, next) => {
    const id = req.body.id;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    Image.update({ _id: id }, { $set: {status : "Accept"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event Accepted",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Rejected
router.post('/events/reject/', (req, res, next) => {
    const id = req.body.id;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    Image.update({ _id: id }, { $set: {status : "Rejected"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Event Rejected",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/events" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//-------------- USERS --------------//

//GET users
router.get('/users', (req, res, next) => {
    User.find()
        .select('')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        name: doc.name,
                        address: doc.address,
                        phone_number: doc.phone_number,
                        status: doc.status,
                        // request: {
                        //     type: "GET",
                        //     url: "http://localhost:3000/admins/users/" + doc._id
                        // }
                    }
                })
            };
            res.status(200).json(response);
            // .render('AdminLTE-2.4.3/AdminLTE-2.4.3/users');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/users/delete', (req, res, next) => {
    var id = req.body.id;
    console.log(id);
    User.update({ _id: id }, { $set: {status : "0"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deactivated",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/users" + id
                // }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
