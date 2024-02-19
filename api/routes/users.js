const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require('../models/user_model');

router.post('/signup', (req, res, next) => {
    UserModel.find({email: req.body.email}).exec().then(user => {
        if (user.length >= 1) {
            res.status(409).json({
                message: 'User already exists'
            });
        } else {
            bcrypt.hash(req.body.password, 1, (err, hash) => {
                if(err) {
                    return res.status(500).json(err);
                } else {
                    const user = new UserModel({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log('Result', result);
                        res.status(201).json({
                            message: 'User created successfully',
                            user: result,
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res, next) => {
    console.log('Response-1');
    UserModel.find({email: req.body.email})
        .exec()
        .then(users => {
            console.log('bcrypt.compare', users);
            if (users.length < 1) {
                console.log('users.length < 1');
                res.status(401).json({
                    message: 'Authentication failed'
                })
            }
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if (err) {
                    console.log('bcrypt.compare-Error');
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: users[0].email,
                        userId: users[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    );
                    console.log('bcrypt.compare-Result');
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Authentication failed'
                });
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        });
    });

router.delete('/:userId', (req, res, next) => {
    UserModel.findOneAndDelete({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted successfully'
            })
        })
        .catch(error => {
            res.status(500).json({
                message: error
            })
        });
});

module.exports = router;