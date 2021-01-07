//verify cart
module.exports.requireCart = (req, res, next) => {
    if (!req.session.cart) {
        res.redirect('back');
        return;
    }
    next();
};