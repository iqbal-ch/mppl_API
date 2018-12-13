const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');   //Generate ID
const checkAuth = require('../middleware/checkauth');
const Order = require('../models/order');
// const Category = require('../models/category');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
// Routesnya /orders


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
router.post('/', checkAuth, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "bismillah");

    Category.findById(req.body.categoryId)
        .then(category => {
            if(!category) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
            const order = new Order ({
                _id: mongoose.Types.ObjectId(),
                date_created : new Date().addHours(7),
                date: req.body.date,
                budget: req.body.budget,
                address : req.body.address,
                description: req.body.description,
                category: req.body.categoryId,
                userId : decode.userId
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                category: result.category,
                date: result.date,
                date_created: result.date_created,
                budget: result.budget,
                address: result.address,
                description: result.description,
                _id: result._id,
                userId: result.userId,
                },
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
router.post('/delete/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.update({ _id: id }, { $set: {status : "0"} })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Rejected",
                request: {
                    type: "PATCH",
                    url: "http://localhost:3000/events" + id
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

// router.delete('/:orderId', checkAuth, (req, res, next) => {
//     Order.remove({ _id: req.params.orderId })
//     .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: "Order Deleted",
//                 request: {
//                     type: 'POST',
//                     url: 'http://localhost:3000/orders',
//                     body: { productId: "ID", quantity: "Number" }
//                 }
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });


module.exports = router;
