const express = require('express');
const router = express.Router();
const cartModel = require('../models/cartModel');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

router.get('/new', authMiddleware.requireAuth, orderController.orderCartDetail );
router.get('/list', (req,res) =>{
    res.render('userOrder', {title: "Lịch sử đặt hàng"});
})
router.post('/send', authMiddleware.requireAuth, orderController.orderCreate);
module.exports = router;