const mongoose = require('mongoose');
const OrderModel = require('../models/order_model');
const ProductModel = require('../models/products_model');

exports.get_all_products = (req, res, next) => {
    ProductModel.find()
        .select('name price productImage _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}

exports.create_product = (req, res, next) => {
    console.log('📍ProductImage', req.file);
    const product = new ProductModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        res.status(201).json({
            message: 'Products created successfully',
            product: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
            }
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json(error)
    });
}

exports.product_by_id = (req, res, next) => {
    const id = req.params.productId;
    ProductModel.findById(id)
        .select('name price productImage _id')
        .exec()
        .then(document => {
            res.status(200).json(document);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    ProductModel.updateOne({_id: id}, {$set: updateOps})
        .exec()
        .then(document => {
            res.status(200).json({
                message: "Product updateed successfuly"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    ProductModel.findOneAndDelete({_id: id})
    .exec()
    .then(result => {
        console.log('Product', result);
        res.status(200).json({message: "Product deleted successfuly"});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
}