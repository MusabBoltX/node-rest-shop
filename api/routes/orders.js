const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/verify_auth');
const OrderController = require('../controllers/orders_controller');

// Handle incoming GET requests to /orders
router.get('/', verifyAuth, OrderController.get_all_orders);

// Handle incoming GET requests to /orders/:productId
router.get('/:orderId', verifyAuth, OrderController.get_order_by_id);

// Handle incoming POST requests to /orders
router.post('/',  verifyAuth, OrderController.create_order);

//Handle incoming DELETE product request /orders/:orderId
router.delete('/:orderId',  verifyAuth, OrderController.delete_order);

module.exports = router;
