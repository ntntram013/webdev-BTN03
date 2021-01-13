const bookModel = require('../models/bookModel');

exports.getCollections = async (req, res, next) => {
    const catalog = await bookModel.listDocuments('Catalog');
    const publisher = await bookModel.listDocuments('Publisher');
    const cover = await bookModel.listDocuments('Cover');
    res.render('home', {
        title: 'Trang chủ',
        catalog: catalog,
        publisher: publisher,
        cover: cover
    });
};