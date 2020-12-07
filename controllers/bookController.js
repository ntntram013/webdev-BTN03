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

exports.pagination = async(req,res)=> {
    const resPerPage = 4;
    const page = +req.query.page || 1;
    const currentPage = parseInt(page);
    const nextPage = parseInt(currentPage + 1);
    const previousPage = parseInt(currentPage - 1);
    const totalPage = Math.ceil(await bookModel.TotalProduct()/resPerPage);
    let IsHasPrev = true;
    let IsHasNext = true;

    if (currentPage == 1){
        IsHasPrev=false;
    }

    if (currentPage == totalPage){
        IsHasNext=false;
    }

    const productPerPage = await bookModel.Pagination(resPerPage,page);


    res.render('store/store',{
        title:'Cửa hàng',
        book: productPerPage,
        previousPage: previousPage,
        nextPage: nextPage,
        IsHasPrev,
        IsHasNext,
        currentPage
    });

}