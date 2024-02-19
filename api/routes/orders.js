const express = require('express');
const mongoose = require('mongoose');
const OrderModel = require('../models/order_model');
const ProductModel = require('../models/products_model');
const router = express.Router();

// Handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    OrderModel.find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Handle incoming GET requests to /orders/:productId
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    OrderModel.findById(id)
    .select('_id quantity product')
    .populate('product')
    .exec()
    .then(order => {
        res.status(200).json(order);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Handle incoming POST requests to /orders
router.post('/', (req, res, next) => {
    ProductModel.findById(req.body.productId)
    .then(product => {
        const order = new OrderModel({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        order.save()
            .then(result => {
                res.status(201).json({
                    message: 'Order was created successfuly',
                    order: result
                });
            })
            .catch(error => {
                res.status(500).json(error);
            });    
    }).catch(err => {
        res.status(404).json({message: 'Product not found'})
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    console.log('OrderId', id);
    OrderModel.findOneAndDelete({_id: id})
    .exec()
    .populate('products_model')
    .then(order => {
        console.log('Order', order);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({message: "Order deleted successfuly"});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
