const express = require('express');
const router = express.Router();
const cartModel = require('../models/cartModel');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');
const cartMiddleware = require('../middlewares/cart');

router.get('/new', authMiddleware.requireAuth, cartMiddleware.requireCart, orderController.orderCartDetail );
router.get('/view', authMiddleware.requireAuth, orderController.orderList);
router.post('/send', authMiddleware.requireAuth,cartMiddleware.requireCart, orderController.orderCreate);
module.exports = router;