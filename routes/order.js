const express = require('express');
const router = express.Router();
const cartModel = require('../models/cartModel');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');
const cartMiddleware = require('../middlewares/cart');

router.get('/new', cartMiddleware.requireCart, orderController.orderCartDetail );
router.get('/view',  orderController.orderList);
router.post('/send', cartMiddleware.requireCart, orderController.orderCreate);
module.exports = router;