const bookModel = require('../models/bookModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const book = await bookModel.list();
    // Pass data to view to display list of books
    res.render('store/store',{title:'Cửa hàng',book});

};
exports.detail = async (req,res,next)=>
{
    console.log(req.params.id);
    const book=await bookModel.detail(req.params.id);
    res.render('store/book',{title:'Chi tiết',book});
}