const bookModel = require('../models/bookModel');
const cartModel = require('../models/cartModel');
exports.addToCart = async (req,res, next) => {
    let cart = new cartModel (req.session.cart ? req.session.cart :{items: {}});
    const book = await bookModel.detail(req.params.id);
    if(book){
        cart.add(book,book._id);
        req.session.cart = cart;
        console.log(req.session.cart);

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
    const book = await bookModel.detail(bookId);
    if(book){
        cart.deleteItem(bookId);
        req.session.cart = cart;
    }
    res.redirect("back");
}
exports.deleteCart = (req, res, next) => {
    req.session.cart = null;
    if (req.user) {
        req.user.cart = {};
        req.user.save();
    }
    res.redirect("back");
};


