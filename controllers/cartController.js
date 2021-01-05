const bookModel = require('../models/bookModel');
const cartModel = require('../models/cartModel');
exports.addToCart = async (req,res, next) => {
    let bookId = req.params.id;
    let cart = new cartModel (req.session.cart ? req.session.cart :{items: {}});
    const book = await bookModel.detail(bookId);
    if(book){
        cart.add(book,book._id);
        req.session.cart = cart;
        console.log(req.session.cart);

    }
    res.redirect("back");
}
exports.detail = function (req,res,next){
    if(!req.session.cart){
        console.log("fail\n");
        return res.render('cart',{title: 'Giỏ hàng',books: null});
    }
    let cart = new cartModel(req.session.cart);
    res.render('cart',{title: 'Giỏ hàng',books: cart.generateArray(), totalPrice: cart.totalPrice});
}

