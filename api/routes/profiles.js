const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
const checkAuth = require('../middleware/checkauth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.get('/:userId', checkAuth, (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decode = jwt.verify(token, "bismillah");
	const userId = decode.userId;
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    message: "User not Exist"
                });
            }
            res.status(200).json({
                user: user,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/profiles'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/edit/:userId', checkAuth, (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decode = jwt.verify(token, "bismillah");
	const userId = decode.userId;
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Profile updated",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/profiles" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/editpassword/:userId', (req, res, next) => {
	// const token = req.headers.authorization.split(" ")[1];
	// const decode = jwt.verify(token, "bismillah");
	// const userId = decode.userId;
    const id = req.params.userId;
  
    bcrypt.hash(req.body.password, 10, (err, hash) => {
    	 User.update({ _id: id }, { $set: {password : hash}})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Profile updated",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/profiles" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    })




});


module.exports = router;