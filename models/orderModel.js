const {ObjectId} = require('mongodb');
const {db} = require("../dal/db");

module.exports.add = async (user, cart) =>{
    const orderCollection = db().collection('Orders');
    const today = new Date();
    const newDate = today.toLocaleString('vi-Vi', {timeZone: "Asia/Jakarta"});
    const newOrder = {
        userId: user.userId,
        info: user.info,
        cart: cart,
        status: 'Processing',
        date: newDate
    }
    const result = await orderCollection.insertOne(newOrder);
    return result;
}
module.exports.listOrder = async (id, status) =>{
    const orderCollection = db().collection('Orders');
    const orderList = await orderCollection.find({userId: ObjectId(id),status: status}).toArray();
    return orderList.reverse();
}
