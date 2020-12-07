const {ObjectId} = require('mongodb');
const {db}=require("../dal/userDal");
exports.detail = async (id)=>
{
    const userCollection=db().collection('User');
    const user = await userCollection.findOne({_id:ObjectId(id)});
    console.log(user);
    return user;
}
exports.update=async (id,fields)=>
{

    const userCollection=db().collection('User');
    await userCollection.updateOne({"_id":ObjectId(id)},{$set: {'userImage': fields}});
}