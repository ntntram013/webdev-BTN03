const bookModel = require('../models/bookModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const book = await bookModel.list();
    // Pass data to view to display list of books
    res.render('store/store',{title:'Cửa hàng',book});

};

exports.detail = async (req,res,next) => {
    const book = await bookModel.detail(req.params.id);
    res.render('store/book',{title:'Chi tiết',book});
}

exports.pagination = async(req,res) => {
    const resPerPage = 8;

    let titleSearch = req.query.title;
    let catId = req.query.catId;

    const slugify = require('slugify');
    let parseBookName;

    let page = +req.query.page || 1;

    let dontFindTitle;
    let productPerPage;
    let totalPage;

    if (titleSearch) {
        parseBookName = slugify(titleSearch, {
            replacement: '',  // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true,      // convert to lower case, defaults to `false`
            strict: false,     // strip special characters except replacement, defaults to `false`
            locale: 'vi'       // language code of the locale to use
        });
        dontFindTitle = false;
        totalPage = Math.ceil(await bookModel.TotalProduct(parseBookName)/resPerPage);
    }
    else if (catId) {
        totalPage = Math.ceil(await bookModel.totalProductById(catId)/resPerPage);
    }
    else {
        parseBookName = undefined;
        dontFindTitle = true;
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
        productPerPage = await bookModel.PaginationCatalog(catId,resPerPage,page);
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
        const catalogName = await bookModel.getCatalogName(catId);
        title = 'Bộ Sưu Tập | ' + catalogName;
    }

    res.render('store/store', {
        title: title,
        book: productPerPage,
        previousPage: previousPage,
        nextPage: nextPage,
        IsHasPrev,
        IsHasNext,
        currentPage,
        dontFindTitle,
        isFound
    });

}