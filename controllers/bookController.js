const bookModel = require('../models/bookModel');



exports.detail = async (req,res,next) => {
    const book = await bookModel.detail(req.params.id);
    res.render('store/book',{title:'Chi tiết',book});
}

exports.pagination = async(req,res) => {
    const resPerPage = 8;

    let titleSearch = req.query.title;
    let catId = req.query.catId;
    let pubId = req.query.pubId;

    const slugify = require('slugify');
    let parseBookName;

    let page = +req.query.page || 1;

    let isFoundTitle;
    let isFoundCatalog;
    let isFoundPublisher;

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
        totalPage = Math.ceil(await bookModel.TotalProduct(parseBookName)/resPerPage);
    }
    else if (catId) {
        isFoundCatalog = true;
        totalPage = Math.ceil(await bookModel.totalProductById('categoryID',catId)/resPerPage);
    }
    else if (pubId) {
        isFoundPublisher = true;
        totalPage = Math.ceil(await bookModel.totalProductById('publisherID',pubId)/resPerPage);
    }
    else {
        parseBookName = undefined;
        isFoundCatalog = false;
        isFoundTitle = false;
        isFoundPublisher = false;
        totalPage = Math.ceil(await bookModel.TotalProduct(parseBookName)/resPerPage);
    }

    if (page < 1) {
        page = 1
    }
    else if (page > totalPage) {
        page = totalPage;
    }

    if (titleSearch) {
        productPerPage = await bookModel.PaginationFindTitle(parseBookName,resPerPage,page);
    }
    else if (catId) {
        productPerPage = await bookModel.PaginationQuery('categoryID',catId,resPerPage,page);
    }
    else if (pubId) {
        productPerPage = await bookModel.PaginationQuery('publisherID',pubId,resPerPage,page);
    }
    else {
        productPerPage = await bookModel.Pagination(resPerPage, page);
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
            //console.log(productPerPage[i]);
            productPerPage[i].resPerPage = resPerPage;
            productPerPage[i].currentPage = currentPage;
        }
    }
    else {
        isFound = false;
    }


    let title = 'Cửa hàng'
    if (titleSearch) {
        title = 'Tìm kiếm | ' + titleSearch;
    }
    else if (catId) {
        const catalogName = await bookModel.getKeyNameOfId(catId,'catalogName','Catalog');
        title = 'Bộ Sưu Tập | ' + catalogName;
    }
    else if (pubId) {
        const publisherName = await bookModel.getKeyNameOfId(pubId,'publisherName','Publisher');
        title = 'Bộ Sưu Tập | ' + 'NXB ' + publisherName;
    }

    const [catalog, publisher, book] = await Promise.all(
        [bookModel.listDocuments('Catalog'),
            bookModel.listDocuments('Publisher'),
            bookModel.list()]);
    // Get books from model
    // Pass data to view to display list of books
    res.render('store/store', {
        title: title,
        catalog: catalog,
        publisher: publisher,
        titleSearch: titleSearch, catId: catId, pubId: pubId,
        book: productPerPage,
        previousPage: previousPage,
        nextPage: nextPage,
        IsHasPrev, IsHasNext, currentPage,
        isFoundTitle, isFoundCatalog, isFoundPublisher,
        isFound
    });

}
module.exports.addComment = async (req,res)=>{
    console.log(req.params.id);
    const bookId = req.params.id;
    const name = (req.body.name != ''?  req.body.name : req.body.username )|| '';
    const comment = req.body.comment;
    const today = new Date();
    const time = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + ' ' +
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const data = {bookId, name, comment, time};

        const result = await bookModel.addComment(data);

    res.redirect('back');
}