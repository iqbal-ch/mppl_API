const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
const checkAuth = require('../middleware/checkauth');
const User = require('../models/user');
const Event = require('../models/event');
const Favorite = require('../models/favorite');
const jwt = require('jsonwebtoken');

router.post('/:eventId' , (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
    Event.findById(req.params.eventId)
        .then(event => {
            if(!event) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }
            const favorite = new Favorite ({
                _id: mongoose.Types.ObjectId(),
                time : new Date().addHours(7),
                event_id: req.body.eventId,
                userId: decode.userId
            });
            return favorite.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Event Liked",
                // request: {
                //     type : "GET",
                //     url: 'http://localhost:3000/orders/' + result._id
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

//Count Likes
router.get('/:eventId', (req, res, next) => {
  var id = req.params.eventId;
  Favorite.find({event_id : id})
  .then(docs => {
      res.status(200).json({
          count: docs.length,
      });
  })
});

module.exports = router;
