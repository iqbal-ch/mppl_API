const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/checkauth');
const jwt = require('jsonwebtoken');

var today = new Date();
var date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
var time = ((today.getHours()+7)%24) + "" + today.getMinutes() + "" + today.getSeconds();
var date_create = date+'_'+time;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../../uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, date_create +"_"+ file.originalname);
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
//Routesnya /products

//Post
router.post('/', upload.single('image'),  (req, res, next) => {

    const barang = new Barang({
        _id: new mongoose.Types.ObjectId(),
        nama : req.body.nama,
        qty: req.body.qty,
        harga : req.body.harga,
        description: req.body.description,
        image: req.file.filename,
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
                    image: result.image,
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

// //Get Event By Category
router.get('/cat/:cat',  (req, res, next) => {
    const cat = req.params.cat;

    Barang.find({category : cat})
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
                        image: "uploads/" + doc.image,
                        category: doc.category,
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


//Get All Event
router.get('/', (req, res, next) => {
    Barang.find()
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
                        image: "http://localhost:3000/uploads/" + doc.image,
                        category: doc.category,
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
        .select('')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    nama: doc.nama,
                    qty: doc.qty,
                    harga: doc.harga,
                    description: doc.description,
                    size: doc.size,
                    image: "http://localhost:3000/uploads/" + doc.image,
                    category: doc.category,

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


router.patch('/edit/:barangid', (req, res, next) => {
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


router.post('/delete/:barangId', (req, res, next) => {
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

module.exports = router;
