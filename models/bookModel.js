const {ObjectId} = require('mongodb');
const {db}=require("../dal/db");

exports.list=async()=>
{
    const bookCollection=db().collection("Product");
    const bookList=await bookCollection.find({isDeleted:false}).toArray();
    return bookList;
}

exports.detail = async (id)=>
{
    const booksCollection=db().collection('Product');
    const book = await booksCollection.findOne({_id:ObjectId(id), isDeleted:false});
    return book;
}

exports.Pagination=async (itemPerPage,currentPage)=> {
    const booksCollection = db().collection('Product');
    const bookPerPage = await booksCollection.find({isDeleted:false}).limit(itemPerPage).skip(itemPerPage*(currentPage-1)).toArray();
    return bookPerPage;

}

exports.PaginationFindTitle=async(searchName,itemPerPage,currentPage)=> {
    const booksCollection = db().collection('Product');
    const bookPerPage = await booksCollection.find({
        isDeleted:false,
        parseBookName:new RegExp(searchName)
    }).limit(itemPerPage).skip(itemPerPage*(currentPage-1)).toArray()
        .catch(e => console.log('Error: ', e.message));
    return bookPerPage;
}


exports.TotalProduct = async(filterName)=>{
    const booksCollection=db().collection('Product');

    if (filterName == undefined){
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