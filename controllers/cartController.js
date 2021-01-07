const bookModel = require('../models/bookModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const {ObjectId} = require('mongodb');
exports.addToCart = async (req,res, next) => {
    let cart = new cartModel (req.session.cart ? req.session.cart :{});
    const book = await bookModel.detail(req.params.id);
    if(book){
        cart.add(book,book._id);
        req.session.cart = cart;
        if (req.user) {
            await cart.saveCart(req.user.cart);
        }
    }
    res.redirect("back");
}
exports.detail = function (req,res,next){
    if(!req.session.cart){
        return res.render('cart',{title: 'Giỏ hàng',books: null});
    }
    let cart = new cartModel(req.session.cart);
    res.render('cart',{title: 'Giỏ hàng',books: cart.generateArray(), totalPrice: cart.totalPrice});
}
exports.deleteItem = async (req,res,next) => {
    const bookId = req.params.id;
    let cart = new cartModel(req.session.cart ? req.session.cart : {items: {}});
    cart.deleteItem(bookId);
    if (req.user) {
        req.user.cart = cart;
        await cart.saveCart(req.user.cart);
    }
    res.redirect("back");
}
exports.deleteCart = async (req, res, next) => {
    req.session.cart = null;
    let cart = new cartModel({});
    if (req.user) {
        await cart.saveCart(req.user.cart);
    }
    res.redirect("back");
};
exports.modifyCart = async (req, res, next) => {
    const bookId = req.query.bookId;
    const qty = req.query.qty;
    if (qty == 0) {
        res.redirect("back");
    }
    let cart = new cartModel(req.session.cart ? req.session.cart : {});
    cart.changeQty(bookId, qty);
    req.session.cart = cart;
    if (req.user) {
        await cart.saveCart(req.user.cart);
    }
    res.redirect("back");
};
exports.mergeCart = async (req, res, next) => {

    if(req.user){
        let cart = new cartModel(req.session.cart ? req.session.cart : {});

        if (req.user.cart != {} && req.user.cart) {
            const  userCart = await cartModel.findCart(req.user.cart);
            cart = cart.addCart(userCart);
            await cart.saveCart(req.user.cart);
        }
        else{
            const cartId = await cart.createCartDB();
            await userModel.saveCart(req.user._id, cartId);
        }
        req.session.cart = cart;
    }

    res.redirect("/");
};


