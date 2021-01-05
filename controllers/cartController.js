const bookModel = require('../models/bookModel');
const cartModel = require('../models/cartModel');
exports.addToCart = async (req,res) => {
    let bookId = req.params.id;
    let cart = new cartModel (req.session.cart ? req.session.cart :{items: {}});
    const book= await bookModel.detail(bookId);
    if(book){
        cart.add(book,book._id);
        req.session.cart = cart;
        console.log(req.session.cart);

    }
    res.redirect("back");

}

