const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel')
const cartController = require('../controllers/cartController');
module.exports.orderCartDetail = function (req, res, next){
    if(req.session.cart && req.session.cart!={}){
        let cart = new cartModel (req.session.cart ? req.session.cart :{});
        res.render('order',{title: 'Đặt hàng',books: cart.generateArray(), totalPrice: cart.totalPrice, user: req.user});
    }
    else{
        res.redirect("back");
    }
}
module.exports.orderCreate = async (req,res,next) => {
    const userId = req.user._id;
    const {userPhone, userAddress, userNote} = req.body;
    const info = {userPhone, userAddress, userNote};
    let cart = req.session.cart;
    const user = {userId, info};
    const  result =  await orderModel.add(user,cart);
    console.log(result);
    if(result.insertedId){
        req.session.cart = null;
        let cart = new cartModel({});
        if (req.user) {
            await cart.saveCart(req.user.cart);
        }

    }
    res.redirect("/order/view");
}
