const bcrypt = require('bcryptjs');
const formidable = require('formidable');
let cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET

})

const userModel = require('../models/userModel');


module.exports.login = (req, res, next) => {
    if (req.user) {
        res.redirect('/user/profile');
        return;
    } else {
        let errors = [];
        if (res.locals.err.length > 0) {
            errors.push(res.locals.err);
        }

        res.render('signIn/login', {
            title: 'Đăng nhập',
            errors: errors
        });
    }
}

module.exports.register = (req, res, next) => {
    res.render('signIn/register', {
        title: 'Đăng ký'
    });
}

module.exports.postRegister = async (req, res) => {
    const {username, email, password, retypePassword} = req.body;
    let errors = [];
    // validate
    if (!username || !email || !password || !retypePassword) {
        errors.push('Vui lòng điền đầy đủ thông tin!');
    } else {
        if (password !== retypePassword) {
            errors.push('Mật khẩu không khớp!');
        }
        if (password.length < 5) {
            errors.push('Mật khẩu phải ít nhất 5 ký tự!');
        }
    }
    // check errors
    if (errors.length > 0) {
        res.render('signIn/register', {
            title: 'Đăng ký',
            username: username, email: email,
            errors: errors
        });
        return;
    } else {
        const userByEmail = await userModel.queryUser('email', email);
        const userByUsername = await userModel.queryUser('username', username);
        if (userByEmail) {
            errors.push('Email đã được đăng ký!');
        }
        if (userByUsername) {
            errors.push('Tên đăng nhập đã được đăng ký!');
        }
        // username or email exists
        const existedUser = userByEmail || userByUsername;
        if (existedUser) {
            res.render('signIn/register', {
                title: 'Đăng ký',
                username: username, email: email,
                errors: errors
            });
            return;
        } else {
            const newUser = {username, email, password};
            await userModel.add(newUser);
            res.render('signIn/register', {
                title: 'Đăng ký',
                success: 'Đăng ký thành công (◕‿↼). Vui lòng xác thực email để '
            });
        }
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/home');
}

module.exports.profile = async (req, res) => {
    const user = await userModel.detail(req.user._id);
    res.render('user/profile', {
        title: 'Profile',
        user
    });
}
module.exports.modify = async (req, res, next) => {
    console.log(req.params.id);
    const user = await userModel.detail(req.user._id);

    res.render('user/userModify', {
        title: 'Chỉnh sửa',
        user
    });
}
exports.postModify = async (req, res, next) => {
    const form = formidable({multiple: true});

    await form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if (files.imageFile && files.imageFile.size > 0) {
            cloudinary.uploader.upload(files.imageFile.path,
                function (error, result) {
                    console.log(result, error);
                    fields.userImage = result.secure_url;
                    userModel.update(id, fields.userImage).then(res.redirect("/user/profile"));
                });
        } else {
            res.redirect("/user/profile");
        }
    });
}