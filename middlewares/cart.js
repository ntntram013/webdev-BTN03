//verify cart
module.exports.requireCart = (req, res, next) => {
    if (!req.session.cart || req.session.cart.totalQty == 0) {
        res.redirect('back');
        return;
    }
    next();
};
