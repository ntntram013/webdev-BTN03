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

    const book = await booksCollection.findOne({_id:ObjectId(id)})
    return book;
}
