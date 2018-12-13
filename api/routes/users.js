const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const checkAuth = require('../middleware/checkauth');

//-----------Sign Up-----------//
router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            // username:req.body.username,
                            password: hash,
                            name: req.body.name,
                            // address: req.body.address,
                            phone_number: req.body.phone_number
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        });
});

//-----------Sign In-----------//
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if(result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    "bismillah"
                );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token,
                        userId : user[0]._id
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Get User
router.get('/', checkAuth, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
  const userId = decode.userId;
    User.find({_id : userId})
        // .populate('userId', 'name')
        .select('')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        name: doc.name,
                        address: doc.address,
                        phone_number: doc.phone_number,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/users/" + doc._id
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

//Edit Profile
router.patch('/edit', checkAuth, (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decode = jwt.verify(token, "bismillah");
	const userId = decode.userId;
    // const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: userId }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Profile updated",
                // request: {
                //     type: "PATCH",
                //     url: "http://localhost:3000/profiles" + id
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



// router.patch('/delete/:userId', checkAuth, (req, res, next) => {
//     const id = req.params.userId;
//     User.update({ _id: id }, { $set: {status : "0"} })
//         .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: "User Deactivated",
//                 request: {
//                     type: "PATCH",
//                     url: "http://localhost:3000/users" + id
//                 }
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// router.delete('/:userId', (req, res, next) => {
//     User.remove({ _id: req.params.userId })
//         .exec()
//         .then(res => {
//             res.status(200).json({
//                 message: "User deleted"
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

module.exports = router;
