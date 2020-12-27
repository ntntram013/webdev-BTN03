const {ObjectId} = require('mongodb');
const {db} = require("../dal/db");


exports.list = async () => {
    const bookCollection = db().collection('Product');
    const bookList = await bookCollection.find({isDeleted:false}).toArray();
    return bookList;
}

exports.detail = async (id) => {
    const booksCollection = db().collection('Product');
    const book = await booksCollection.findOne({_id:ObjectId(id), isDeleted:false});
    return book;
}

exports.Pagination = async (itemPerPage,currentPage) => {
    const booksCollection = db().collection('Product');
    const bookPerPage = await booksCollection.find({isDeleted:false}).limit(itemPerPage).skip(itemPerPage*(currentPage-1)).toArray();
    return bookPerPage;
}

exports.PaginationFindTitle = async (searchName,itemPerPage,currentPage) => {
    const booksCollection = db().collection('Product');
    const bookPerPage = await booksCollection.find({
        isDeleted: false,
        parseBookName: new RegExp(searchName)
    }).limit(itemPerPage).skip(itemPerPage*(currentPage-1)).toArray()
        .catch(e => console.log('Error: ', e.message));
    return bookPerPage;
}


exports.TotalProduct = async (filterName) => {
    const booksCollection = db().collection('Product');

    if (!filterName) {
        const numBook = await booksCollection.find({isDeleted: false}).count();
        return numBook;
    }
    else {
        const numBook = await booksCollection.find({isDeleted: false,
            parseBookName:new RegExp(filterName)
        }).count();
        return numBook;
    }
}

module.exports.listDocuments = async (collectionName) => {
    const catalogCollection = db().collection(collectionName);
    const catalogList = await catalogCollection.find({isDeleted:false}).toArray();
    return catalogList;
}

module.exports.getKeyNameOfId = async (Id,keyName,collectionName) => {
    const catalogCollection = db().collection(collectionName);

    let query = {};
    query["isDeleted"] = false;
    query["_id"] = ObjectId(Id);

    let projection = {};
    projection["_id"] = 0;
    projection[keyName] = 1;

    const name = await catalogCollection.find(query).project(projection);

    for await (const doc of name) {
        return doc[keyName];
    }
}

module.exports.totalProductById = async (queryField,filterId) => {
    const booksCollection = db().collection('Product');
    let query = {};
    if (!filterId) {
        query["isDeleted"] = false;
        const numBook = await booksCollection.find(query).count();
        return numBook;
    }
    else {
        query["isDeleted"] = false;
        query[queryField] = ObjectId(filterId);
        const numBook = await booksCollection.find(query).count();
        return numBook;
    }
}

module.exports.PaginationQuery = async (queryField,filterId,itemPerPage,currentPage) => {
    const booksCollection = db().collection('Product');

    let query = {};
    query["isDeleted"] = false;
    query[queryField] = ObjectId(filterId);

    const bookPerPage = await booksCollection.find(query).limit(itemPerPage).skip(itemPerPage*(currentPage-1)).toArray()
        .catch(e => console.log('Error: ', e.message));
    return bookPerPage;
}
