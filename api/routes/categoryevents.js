const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
const checkAuth = require('../middleware/checkauth');
const Categoryevent = require('../models/categoryevent');

router.post('/',  (req, res, next) => {
    const categoryevent = new Categoryevent({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    categoryevent
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Category successfully created',
                createdCategory: {
                    name: result.name,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/categoryevents/" + result._id
                    }
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


router.get('/', (req, res, next) => {
    Categoryevent.find()
        .select('name _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                categoryevents: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/categoryevents/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;
