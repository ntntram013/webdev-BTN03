const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');

const {db} = require("../dal/userDal");
const userService = require('../models/userService');

exports.detail = async (id) => {
    const userCollection = db().collection('User');
    const user = await userCollection.findOne({_id: ObjectId(id)});
    return user;
}

exports.updateImage = async (id, fields) => {
    const userCollection = db().collection('User');
    await userCollection.updateOne({"_id": ObjectId(id)}, {$set: {'userImage': fields}});
}
exports.updateInfo = async (id, info) =>{
    const userCollection = db().collection('User');
    await userCollection.updateOne(
        {"_id": ObjectId(id)},
        {$set: {'name': info.name,
                'address': info.address,
                'dob': info.dob,
                'gender': info.gender,
                'detail': info.detail,
                'phone': info.phone}});
}

exports.updateByQuery = async (id, field, fieldValue) => {
    const userCollection = db().collection('User');
    let updateVal = {};
    updateVal[field] = fieldValue;
    const result = await userCollection.updateOne({
        "_id": ObjectId(id)
    }, {
        $set: updateVal
    });
    return result;
}

module.exports.queryUser = async (queryField, fieldInfo) => {
    const userCollection = db().collection('User');

    let query = {};
    query["isDeleted"] = false;
    query[queryField] = fieldInfo;

    const user = await userCollection.findOne(query);
    return user;
}

module.exports.activateUser = async (id) => {
    const userCollection = db().collection('User');
    const result = await userCollection.updateOne({
        "_id": ObjectId(id)
    }, {
        $set: {
            'isActivated': true
        }
    });
    return result;
}

module.exports.checkActivatedUser = async (id) => {
    const userCollection = db().collection('User');
    const user = await userCollection.findOne({
        _id: id,
        isActivated: true
    });
    if (user) {
        return true;
    }
    return false;
}

module.exports.checkBlockedUser = async (id) => {
    const userCollection = db().collection('User');
    const user = await userCollection.findOne({
        _id: id,
        isBlocked: true
    });
    if (user) {
        return true;
    }
    return false;
}


module.exports.add = async (user, cart) => {
    const userCollection = db().collection('User');
    const {username, email, password} = user;
    // hash password
    const hashedPassword = await userService.hashPass(password);
    const newUser = {
        username,
        email,
        password: hashedPassword,
        isDeleted: false,
        isActivated: false,
        isBlocked: false,
        address: "",
        dob: "",
        gender: "",
        detail: "",
        userImage: "https://res.cloudinary.com/webdevteam468/image/upload/v1607323611/dqvskwss8c2g1pbavl31.jpg",
        phone: "",
        cart:cart,
        order:"",
        name: username
    };
    const result = await userCollection.insertOne(newUser);
    return result;
}
module.exports.saveCart = async (id, cartId)=>{
    const userCollection = db().collection('User');
    const result = await userCollection.updateOne({
        "_id": id
    }, {
        $set: {
            'cart': cartId
        }
    });
    return result;
}

