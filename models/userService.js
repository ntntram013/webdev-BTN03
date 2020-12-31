const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

module.exports.checkCredential = async (loginInfo,password) => {
    const userByUsername = await userModel.queryUser('username', loginInfo);
    const userByEmail = await userModel.queryUser('email', loginInfo);

    const existedUser = userByEmail || userByUsername;

    if (existedUser) {
        if (await userModel.checkActivatedUser(existedUser._id) === false ) {
            return false;
        }
        else {
            let checkPassword = await bcrypt.compare(password, existedUser.password);
            if (!checkPassword) {
                return false;
            }
            return existedUser;
        }
    }
    return false;
}

exports.getUser = (id) => {
    return userModel.detail(id);
}
