const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
const checkAuth = require('../middleware/checkauth');
const Order = require('../models/order');
// const Category = require('../models/category');
const Barang = require('../models/barang');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
// Routesnya /orders

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


//Get Orders
router.get('/', checkAuth, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
  const userId = decode.userId
    Order.find({userId : userId})
        // .select('category date budget address description _id')
        .populate('category', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        category: doc.category,
                        date: doc.date,
                        budget: doc.budget,
                        address: doc.address,
                        description: doc.description,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/orders/' + doc._id
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

Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

//Post Orders
router.post('/:IdBarang', checkAuth, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");
  const id = req.params.IdBarang;

  Barang.findById(id)
    .then(barang => {
        if(barang.qty == 0){
            return res.status(404).json({
                message: "Stok Habis"
            });
        }
            const order = new Order ({
                _id: mongoose.Types.ObjectId(),
                date_created : new Date().addHours(7),
                address : req.body.address,
                qty : req.body.qty,
                userId : decode.userId,
                IdBarang : id
            });
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: "Order stored",
                createdOrder: {},
                request: {
                    type : "GET",
                    url: 'http://localhost:3000/orders/' + result._id
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

//Get By OrderId
router.get('/:orderId', checkAuth, (req, res, next) => {

    Order.findById(req.params.orderId)
        .populate('category', 'name')
        .exec()
        .then(order => {
            if(!order) {
                return res.status(404).json({
                    message: "Order not Found"
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


//Delete Orders
// router.post('/delete/:orderId', checkAuth, (req, res, next) => {
//     const id = req.params.orderId;
//     Order.update({ _id: id }, { $set: {status : "0"} })
//         .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: "Order Rejected",
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


//Upload Bukti Pembayaran
router.post('/upload/:IdBarang', upload.single('image'), (req, res, next) => {
    // const token = req.headers.authorization.split(" ")[1];
    // const decode = jwt.verify(token, "bismillah");
    const id = req.params.IdBarang;
  
    Order.update({_id: id}, {$set: {image : req.file.path}})
          .then(result => {
              res.status(201).json({
                  message: "Uploaded",
                  createdOrder: {},
                  request: {
                      type : "GET",
                      url: 'http://localhost:3000/orders/' + result._id
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
