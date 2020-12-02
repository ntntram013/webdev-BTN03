const productModel = require('../models/productModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const product = await productModel.list();
    // Pass data to view to display list of books
    res.render('store',{title:'Store',product});

};
exports.detail = (req,res,next)=>{
    const productDetail = productModel.detail();
    res.render('productDetail',{title:'Detail',productDetail})
}