const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');


module.exports.checkCredential = async (loginInfo, password) => {
    const userByUsername = await userModel.queryUser('username', loginInfo);
    const userByEmail = await userModel.queryUser('email', loginInfo);

    const existedUser = userByEmail || userByUsername;

    if (existedUser) {
        if (await userModel.checkBlockedUser(existedUser._id) === true) {
            return -3;
        }
        if (await userModel.checkActivatedUser(existedUser._id) === false) {
            return -2;
        }

        let checkPassword = await bcrypt.compare(password, existedUser.password);
        if (!checkPassword) {
            return -1;
        }
        return existedUser;

    }
    return 0;
}

exports.getUser = (id) => {
    return userModel.detail(id);
}
