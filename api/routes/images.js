const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/checkauth');
const jwt = require('jsonwebtoken');
const Image = require('../models/image');
const Event = require('../models/event');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toDateString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // reject a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


// router.post('/', checkAuth, upload.single('event_image'), (req, res, next) => {
//     console.log(req.file);
//     const token = req.headers.authorization.split(" ")[1];
//     const decode = jwt.verify(token, "bismillah");

//     const image = new Image({
//         _id: new mongoose.Types.ObjectId(),
//         event_image: req.file.path,
//         userId: decode.userId

//     });

//     image
//         .save()
//         .then(result => {
//             console.log(result);
//             res.status(200).json({
//                 message: 'Upload successfully posted',
//                 postedUpload: {
//                     event_image: result.event_image,
//                     userId: result.userId,
//                     request: {
//                         type: 'GET',
//                         url: "http://localhost:3000/images/" + result._id
//                     }
//                 }
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error : err
//             });
//         });
// });

router.post('/:eventId', checkAuth,upload.single('event_image_path'), (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
  const id = req.params.eventId;

    Event.findById(id)
        .then(event => {
            if(!event) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }
            const image = new Image ({
                _id: new mongoose.Types.ObjectId(),
                event_image_path: req.file.path,
                eventId : id,
                userId: decode.userId

            });
            return image.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Uploaded",
                Uploaded: {
                     id: result._id,
                    event_image_path: result.event_image_path,
                    eventId : result.eventId,
                    userId: result.userId
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


// router.post('/', checkAuth, upload.single('event_image_path'), (req, res, next) => {
//      console.log(req.file);
//      const image = new Image({
//         _id: new mongoose.Types.ObjectId(),
//         event_image_path: req.file.path,
//         eventId : eventId,
//         userId: decode.userId

//     });
//     image
//         .save()
//         .then(result => {
//             console.log(result);
//             res.status(200).json({
//                 message: 'Upload successfully posted',
//                 Uploaded: {
//                     id: result._id,
//                     event_image_path: result.event_image_path,
//                     eventId : result.eventId,
//                     userId: result.userId
//                 }
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error : err
//             });
//         });
// });

router.get('/user', checkAuth, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
  const userId = decode.userId;
    Image.find({userId : userId})
        .populate('eventId', 'title date_create date_event description city')
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .exec()
        .then(docs => {
            const response = {
                events: docs.map(doc => {
                    return {
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

router.get('/', checkAuth, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
  const userId = decode.userId;
    Image.find({status: "Accept"})
        .populate('eventId', 'title date_create date_event description city')
        .populate('userId', 'name')
        .populate('categoryevent', 'name')
        .exec()
        .then(docs => {
            const response = {
                image: docs.map(doc => {
                    return {
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





module.exports = router;
