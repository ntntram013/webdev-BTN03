const {ObjectId} = require('mongodb');

const {db} = require("../dal/db");


module.exports.list = async () => {
    const bookCollection = db().collection('Product');
    const bookList = await bookCollection.find({isDeleted: false}).toArray();
    return bookList;
}

module.exports.detail = async (id) => {
    const booksCollection = db().collection('Product');
    const book = await booksCollection.findOne({_id: ObjectId(id), isDeleted: false});
    return book;
}

module.exports.increaseView = async (id) => {
    const booksCollection = db().collection('Product');
    const filter = { _id: ObjectId(id) };
    const options = { upsert: false };
    const updateDoc = {
        $inc: { view: 1 }
    };
    const result = await booksCollection.updateOne(filter, updateDoc, options);
}

module.exports.Pagination = async (itemPerPage, currentPage,order) => {
    const booksCollection = db().collection('Product');
    if(order){
        const sort = {};
        sort["price"] = order;
        const bookPerPage = await booksCollection.find({isDeleted: false})
            .sort(sort)
            .limit(itemPerPage)
            .skip(itemPerPage * (currentPage - 1))
            .toArray();
        return bookPerPage;
    }else{
        const bookPerPage = await booksCollection.find({isDeleted: false})
            .limit(itemPerPage)
            .skip(itemPerPage * (currentPage - 1))
            .toArray();
        return bookPerPage;
    }

}

module.exports.PaginationFindTitle = async (searchName, itemPerPage, currentPage,order) => {
    const booksCollection = db().collection('Product');
    if(order){
        const sort = {};
        sort["price"] = order;
        const bookPerPage = await booksCollection.find({
            isDeleted: false,
            parseBookName: new RegExp(searchName)
        }).sort(sort).limit(itemPerPage).skip(itemPerPage * (currentPage - 1)).toArray()
            .catch(e => console.log('Error: ', e.message));
        return bookPerPage;
    }else{
        const bookPerPage = await booksCollection.find({
            isDeleted: false,
            parseBookName: new RegExp(searchName)
        }).limit(itemPerPage).skip(itemPerPage * (currentPage - 1)).toArray()
            .catch(e => console.log('Error: ', e.message));
        return bookPerPage;
    }

}

// phân trang dựa theo queryField & filterId
module.exports.PaginationQuery = async (queryField, filterId, itemPerPage, currentPage,order) => {
    const booksCollection = db().collection('Product');
    let query = {};
    query["isDeleted"] = false;
    query[queryField] = ObjectId(filterId);
    if(order){
        const sort = {};
        sort["price"] = order;
        const bookPerPage = await booksCollection.find(query).sort(sort).limit(itemPerPage).skip(itemPerPage * (currentPage - 1)).toArray()
            .catch(e => console.log('Error: ', e.message));
        return bookPerPage;
    }else{
        const bookPerPage = await booksCollection.find(query).limit(itemPerPage).skip(itemPerPage * (currentPage - 1)).toArray()
            .catch(e => console.log('Error: ', e.message));
        return bookPerPage;
    }
}

module.exports.queryBook = async (catId, pubId, coverId, price, itemPerPage, currentPage,order) => {
    const booksCollection = db().collection('Product');
    let query = {};
    if(price === 1){
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 0 , $lt : 50000}
        };
    }
    else if(price === 2){
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 50000 , $lt : 100000}
        };
    }
    else if(price === 3){
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 100000 , $lt : 200000}
        };
    }
    else{
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 200000 }
        };
    }

    if(order){
        const sort = {};
        sort["price"] = order;
        const bookPerPage = await booksCollection.find(query).sort(sort).limit(itemPerPage).skip(itemPerPage * (currentPage - 1)).toArray()
            .catch(e => console.log('Error: ', e.message));
        return bookPerPage;
    }else{
        const bookPerPage = await booksCollection.find(query).limit(itemPerPage).skip(itemPerPage * (currentPage - 1)).toArray()
            .catch(e => console.log('Error: ', e.message));
        return bookPerPage;
    }
}


module.exports.TotalProduct = async (filterName) => {
    const booksCollection = db().collection('Product');

    if (!filterName) {
        const numBook = await booksCollection.find({isDeleted: false}).count();
        return numBook;
    } else {
        const numBook = await booksCollection.find({
            isDeleted: false,
            parseBookName: new RegExp(filterName)
        }).count();
        return numBook;
    }
}
// liệt kê danh sách các nxb, các thể loại, v.v từ collectionName
module.exports.listDocuments = async (collectionName) => {
    const catalogCollection = db().collection(collectionName);
    const catalogList = await catalogCollection.find({isDeleted: false}).toArray();
    return catalogList;
}
// lấy tên của 1 nxb, thể loại cụ thể từ collectionName dựa theo Id & keyName (để hiện title khi search)
module.exports.getKeyNameOfId = async (Id, keyName, collectionName) => {
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
// tổng số sản phẩm theo queryField & filterId
module.exports.totalProductById = async (queryField, filterId) => {
    const booksCollection = db().collection('Product');
    let query = {};
    if (!filterId) {
        query["isDeleted"] = false;
        const numBook = await booksCollection.find(query).count();
        return numBook;
    } else {
        query["isDeleted"] = false;
        query[queryField] = ObjectId(filterId);
        const numBook = await booksCollection.find(query).count();
        return numBook;
    }
}
module.exports.totalProductBySearch = async (pubId, catId, coverId, price) => {
    const booksCollection = db().collection('Product');

    let query = {};
    if(price === 1){
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 0 , $lt : 50000}
        };
    }
    else if(price === 2){
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 50000 , $lt : 100000}
        };
    }
    else if(price === 3){
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 100000 , $lt : 200000}
        };
    }
    else{
        query = {
            "isDeleted": false,
            "publisherID": ObjectId(pubId),
            "categoryID": ObjectId(catId),
            "coverForm": ObjectId(coverId),
            price: { $gte : 200000 }
        };
    }

    const numBook = await booksCollection.find(query).count();
    return numBook;
}


module.exports.addComment = async (data) =>{
    const commentCollection = db().collection('Comments');
    const  result = await commentCollection.insertOne({
        bookId: data.bookId,
        name: data.name,
        comment: data.comment,
        time: data.time,
        isDeleted: false
    });
    return result;
}
module.exports.getComment = async (id) =>{
    const commentCollection = db().collection('Comments');
    const  result = await commentCollection.find({bookId: id, isDeleted: false}).toArray();
    return result.reverse();
}