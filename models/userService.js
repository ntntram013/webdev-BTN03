const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

module.exports.checkCredential = async (loginInfo,password) => {
    let err = "";

    const userByUsername = await userModel.queryUser('username', loginInfo);

    if (userByUsername) {
        let checkPassword = await bcrypt.compare(password,userByUsername.password);
        if (!checkPassword) {
            err = "sai mat khau!";
            return false;
        }
        return userByUsername;
    }
    // else if (userByUsername.isActivated === false) {
    //     err = "acc bi block roi!";
    //     return false;
    // }
    return false;
}

exports.getUser = (id) => {
    return userModel.queryUser('_id',id);
}
