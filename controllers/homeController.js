const bookModel = require('../models/bookModel');

exports.getCatalog = async (req, res, next) => {
    const catalog = await bookModel.listCatalog();
    res.render('home', {
        title: 'Trang chủ',
        catalog: catalog
    });
};