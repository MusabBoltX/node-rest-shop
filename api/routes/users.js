const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/verify_auth');
const UserController = require('../controllers/user_controller');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.delete('/:userId', verifyAuth, UserController.delete_user);

module.exports = router;