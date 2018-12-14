const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/checkauth');
const jwt = require('jsonwebtoken');

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


const Barang = require('../models/barang');
// const Categoryevent = require('../models/categoryevent');
// const Image = require('../models/image');
// var date_create = Date.now();
// var today = new Date();
// var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// var time = ((today.getHours()+7)%24) + ":" + today.getMinutes() + ":" + today.getSeconds();
// var date_create = date+' '+time;

//var name = Jwts.parser().setSigningKey("bismillah").parseClaimsJws("base64EncodedJwtHere").getBody().get("name", String.class);

//Routesnya /products

//Post
router.post('/', checkAuth, upload.single('image'),  (req, res, next) => {
    // const token = req.headers.authorization.split(" ")[1];
    // const decode = jwt.verify(token, "bismillah");

    const barang = new Barang({
        _id: new mongoose.Types.ObjectId(),
        nama : req.body.nama,
        qty: req.body.qty,
        harga : req.body.harga,
        description: req.body.description,
        size: req.body.size,
        image: req.file.path,
        // userId: decode.userId,
        category: req.body.category

    });

    barang
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Barang successfully created',
                created: {
                    nama: result.nama,
                    qty: result.qty,
                    harga: result.harga,
                    description: result.description,
                    _id: result._id,
                    size: result.size,
                    image: result.image,
                    // userId: result.userId,
                    category: result.category,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/barangs/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
});

// //Get Event By UserId
// router.get('/user', checkAuth, (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   const decode = jwt.verify(token, "bismillah");
//   const userId = decode.userId;
//     Event.find({userId : userId})
//         .populate('image', 'event_image_path')
//         .populate('userId', 'name')
//         .populate('categoryevent', 'name')
//         .select('')
//         .exec()
//         .then(docs => {
//             const response = {
//                 count: docs.length,
//                 events: docs.map(doc => {
//                     return {
//                         title: doc.title,
//                         date_create: doc.date_create,
//                         date_event: doc.date_event,
//                         description: doc.description,
//                         image: doc.image,
//                         _id: doc._id,
//                         // province: doc.province,
//                         city: doc.city,
//                         // address: doc.address,
//                         // link: doc.link,
//                         userId: doc.userId,
//                         categoryevent: doc.categoryevent,
//                         request: {
//                             type: "GET",
//                             url: "http://localhost:3000/events/" + doc._id
//                         }
//                     }
//                 })
//             };
//             res.status(200).json(response);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });


//Get All Event
router.get('/', (req, res, next) => {
    Barang.find()
        // .populate('image')
        // .populate('userId', 'name')
        // .populate('categoryevent', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                barangs: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nama: doc.nama,
                        qty: doc.qty,
                        harga: doc.harga,
                        description: doc.description,
                        size: doc.size,
                        image: doc.image,
                        // userId: doc.userId,
                        category: doc.category,
                        // image: doc.image,
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

// Get by EventId
router.get('/:barangId', (req, res, next) => {
    const id = req.params.barangId;
    Barang.findById(id)
        // .populate('image', 'event_image_path')
        // .populate('userId', 'name')
        // .populate('categoryevent', 'name')
        .select('')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                res.status(200).json({
                    barang: doc,
                    request: {
                        type: "GET",
                        desc: "Get all barang",
                        url: "http://localhost:3000/barangs"
                    }
                });
            } else {
                res.status(404).json({message: "Format ID tidak valid"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error : err});
        });
});


// router.post('/search', (req, res, next) => {
//     var title = req.body.title;
//     Event.find({title : title})
//         .populate('userId', 'name')
//         .populate('categoryevent', 'name')
//         .select('')
//         .exec()
//         .then(doc => {
//             console.log("From database", doc);
//             if(doc) {
//                 res.status(200).json({
//                     event: doc,
//                     request: {
//                         type: "GET",
//                         desc: "Get all events",
//                         url: "http://localhost:3000/events"
//                     }
//                 });
//             } else {
//                 res.status(404).json({message: "Format EventID tidak valid"});
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({error : err});
//         });
// });

router.patch('/edit/:barangid', checkAuth, (req, res, next) => {
    const id = req.params.barangId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Barang.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "updated",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/barangs" + id
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

// router.patch('/accept/:eventId', checkAuth, (req, res, next) => {
//     const id = req.params.eventId;
//     // const updateOps = {};
//     // for (const ops of req.body) {
//     //     updateOps[ops.propName] = ops.value;
//     // }
//     Event.update({ _id: id }, { $set: {status : "Accept"} })
//         .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: "Event Accepted",
//                 request: {
//                     type: "PATCH",
//                     url: "http://localhost:3000/events" + id
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

router.post('/delete/:barangId', checkAuth, (req, res, next) => {
    const id = req.params.barangId;
    Barang.update({ _id: id }, { $set: {status : "0"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Deleted",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/barangs" + id
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

// router.delete('/delete/:eventId', checkAuth, (req, res, next) => {
//     const id = req.params.eventId;
//     Event.remove({_id: id})
//         .exec()
//         .then(result => {
//             res.status(200).json(result);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

module.exports = router;
