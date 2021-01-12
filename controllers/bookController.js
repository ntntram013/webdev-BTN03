const queryString = require('query-string');
const slugify = require('slugify');

const bookModel = require('../models/bookModel');


exports.detail = async (req,res,next) => {
    await bookModel.increaseView(req.params.id);
    let [book, comment] =  await Promise.all([
        bookModel.detail(req.params.id), bookModel.getComment(req.params.id)]);

    res.render('store/book',{title:'Chi tiết',book, comment});
}

exports.pagination = async(req,res) => {
    const resPerPage = 8;

    let titleSearch = req.query.title;
    let catId = req.query.catId;
    let pubId = req.query.pubId;
    let order = +req.query.order;
    let page = +req.query.page || 1;


    let isLastSortInc = false;
    let isLastSortDec = false;
    if(order === 1){
        isLastSortInc = true;
    }
    else if(order === -1){
        isLastSortDec = true;
    }

    let parseBookName;

    let isFoundTitle;
    let isFoundCatalog;
    let isFoundPublisher;

    let totalProducts;
    let productPerPage;
    let totalPage;

    if (titleSearch) {
        parseBookName = slugify(titleSearch, {
            replacement: ' ',  // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true,      // convert to lower case, defaults to `false`
            strict: false,     // strip special characters except replacement, defaults to `false`
            locale: 'vi'       // language code of the locale to use
        });
        isFoundTitle = true;
        totalProducts = await bookModel.TotalProduct(parseBookName);
        totalPage = Math.ceil(totalProducts/resPerPage);
    }
    else if (catId) {
        isFoundCatalog = true;
        totalProducts = await bookModel.totalProductById('categoryID',catId);
        totalPage = Math.ceil(totalProducts/resPerPage);
    }
    else if (pubId) {
        isFoundPublisher = true;
        totalProducts = await bookModel.totalProductById('publisherID',pubId);
        totalPage = Math.ceil(totalProducts/resPerPage);
    }
    else {
        parseBookName = undefined;
        isFoundCatalog = false;
        isFoundTitle = false;
        isFoundPublisher = false;
        totalProducts = await bookModel.TotalProduct(parseBookName);
        totalPage = Math.ceil(totalProducts/resPerPage);
    }

    if (page < 1) {
        page = 1
    }
    else if (page > totalPage) {
        page = totalPage;
    }

    if (titleSearch) {
        productPerPage = await bookModel.PaginationFindTitle(parseBookName,resPerPage,page,order);
    }
    else if (catId) {
        productPerPage = await bookModel.PaginationQuery('categoryID',catId,resPerPage,page,order);
    }
    else if (pubId) {
        productPerPage = await bookModel.PaginationQuery('publisherID',pubId,resPerPage,page,order);
    }
    else {
        productPerPage = await bookModel.Pagination(resPerPage, page, order);
    }

    let currentPage = page;
    let nextPage = currentPage + 1;
    let previousPage = currentPage - 1;

    let IsHasPrev = true;
    let IsHasNext = true;
    if (currentPage === 1) {
        IsHasPrev = false;
    }
    if (currentPage === totalPage) {
        IsHasNext = false;
    }

    let isFound = true;
    if (productPerPage) {
        for (i = 0; i < productPerPage.length; i++) {
            productPerPage[i].resPerPage = resPerPage;
            productPerPage[i].currentPage = currentPage;
        }
    }
    else {
        isFound = false;
    }


    const nextQueryString = queryString.stringify({...req.query,page: nextPage});
    const prevQueryString = queryString.stringify({...req.query,page: previousPage});
    const curQueryString = queryString.stringify({...req.query,page: currentPage});
    const defaultQueryString = queryString.stringify({...req.query,page: 1, order: null},{skipNull: true});

    const nextQueryStringWithoutOrder = queryString.stringify({...req.query,page: 1, order: null}, {skipNull: true});
    const prevQueryStringWithoutOrder = queryString.stringify({...req.query,page: 1,order: null},{skipNull: true});
    const curQueryStringWithoutOrder = queryString.stringify({...req.query,page: 1, order: null},{skipNull: true});

    let title = 'Cửa hàng';
    let catalogName;
    let publisherName;
    if (titleSearch) {
        title = 'Tìm kiếm | ' + titleSearch;
    }
    else if (catId) {
        catalogName = await bookModel.getKeyNameOfId(catId,'catalogName','Catalog');
        title = 'Bộ Sưu Tập | ' + catalogName;
    }
    else if (pubId) {
        publisherName = await bookModel.getKeyNameOfId(pubId,'publisherName','Publisher');
        title = 'Bộ Sưu Tập | ' + 'NXB ' + publisherName;
    }

    const [catalog, publisher, book] = await Promise.all(
        [bookModel.listDocuments('Catalog'),
            bookModel.listDocuments('Publisher'),
            bookModel.list()]);
    // Get books from model
    // Pass data to view to display list of books
    res.render('store/store', {
        title: title, catalog, publisher,
        catalogName, publisherName, totalProducts, titleSearch,
        book: productPerPage,
        previousPage, nextPage, currentPage,
        IsHasPrev, IsHasNext,
        nextQueryString,prevQueryString,curQueryString,
        nextQueryStringWithoutOrder,prevQueryStringWithoutOrder,curQueryStringWithoutOrder,defaultQueryString,
        isFound,isLastSortInc,isLastSortDec
    });

}
module.exports.addComment = async (req,res)=>{
    console.log(req.params.id);
    const bookId = req.params.id;
    const name = (req.body.name != ''?  req.body.name : req.body.username )|| '';
    const comment = req.body.comment;
    const today = new Date();
    const time = today.toLocaleString('vi-Vi', {timeZone: "Asia/Jakarta",hour12: false});
    const data = {bookId, name, comment, time};

        const result = await bookModel.addComment(data);

    res.redirect('back');
}