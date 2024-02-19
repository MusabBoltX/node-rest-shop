const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});
const ProductModel = require('../models/products_model');

// Handle incoming GET requests to /products
router.get('/', (req, res, next) => {
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
});

// Handle incoming POST requests to /products
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log('ProductImage', req.file);
    const product = new ProductModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        res.status(201).json({
            message: 'Products created successfully',
            product: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost/:3000/products/' + result._id
                }
            }
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json(error)
    });
});

// Handle incoming GET requests to /products/:productId
router.get('/:productId', (req, res, next) => {
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
});

// Handle incoming PATCH requests to /products/:productId
router.patch('/:productId', (req, res, next) => {
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
});

router.delete('/:productId', (req, res, next) => {
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
});

module.exports = router;
