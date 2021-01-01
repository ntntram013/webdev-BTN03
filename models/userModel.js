const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');

const {db} = require("../dal/userDal");

exports.detail = async (id) => {
    const userCollection = db().collection('User');
    const user = await userCollection.findOne({_id: ObjectId(id)});
    return user;
}

exports.update = async (id, fields) => {
    const userCollection = db().collection('User');
    await userCollection.updateOne({"_id": ObjectId(id)}, {$set: {'userImage': fields}});
}

module.exports.queryUser = async (queryField, fieldInfo) => {
    const userCollection = db().collection('User');

    let query = {};
    query["isDeleted"] = false;
    query[queryField] = fieldInfo;

    const user = await userCollection.findOne(query);
    return user;
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

module.exports.add = async (user) => {
    const userCollection = db().collection('User');
    const {username, email, password} = user;
    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
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
        name: username
    };
    await userCollection.insertOne(newUser);
}

