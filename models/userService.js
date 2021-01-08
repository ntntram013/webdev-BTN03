const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

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

module.exports.getUser = (id) => {
    return userModel.detail(id);
}

module.exports.hashPass = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

//  wrapper function to await nodemailer
module.exports.sendMail = async (config, mailOptions) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport(config);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error is " + error);
                resolve(false); // or use reject(false) but then you will have to handle errors
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}
