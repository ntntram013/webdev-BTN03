const bcrypt = require('bcryptjs');
const formidable = require('formidable');
let cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET

})


const userModel = require('../models/userModel');
const id = '5fcdcd6e4fa7af1f08ba7125';

module.exports.login = (req,res,next) => {
    if(req.signedCookies.cookieID === 'abcxyz'){
        res.redirect('/user/profile');
        return;
    }
    res.render('signIn/login',{
        title:'Đăng nhập'
    });
}

module.exports.postLogin = (req,res) => {
    const email = req.body.email;
    const pass = req.body.password;

    if(email !== 'user@gmail.com'){
        res.render('signIn/login',{
            title:'Đăng nhập',
            errors: [
                'Người dùng không tồn tại!'
            ]
        });
        return;
    }

    if(pass !== 'user'){
        res.render('signIn/login',{
            title:'Đăng nhập',
            errors: [
                'Mật khẩu không đúng!'
            ]
        });
        return;
    }

    res.cookie('cookieID','abcxyz',{
        signed:true,
        maxAge: 60*60*1000 // 60 minutes
    });

    res.redirect('/home');
}

module.exports.register = (req,res,next) => {
    res.render('signIn/register', {
        title:'Đăng ký'
    });
}

module.exports.postRegister = async (req,res) => {
    const {username,email,password,retypePassword} = req.body;
    let errors = [];

    // validate
    if (!username || !email || !password || !retypePassword) {
        errors.push('Vui lòng điền đầy đủ thông tin!');
    }
    else {
        if (password !== retypePassword) {
            errors.push('Mật khẩu không khớp!');
        }
        if (password.length < 1) {
            errors.push('Mật khẩu phải ít nhất 6 ký tự!');
        }
    }
    // check errors
    if (errors.length >0) {
        res.render('signIn/register',{
            title:'Đăng ký',
            username: username, email: email,
            errors: errors
        });
        return;

    }
    else {
        const userByEmail = await userModel.queryUser('email',email);
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
            res.render('signIn/register',{
                title:'Đăng ký',
                username: username, email: email,
                errors: errors
            });
            return;
        }
        else {
            // hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = {username, email, password: hashedPassword, isDeleted: false, isActivated: true};
            await userModel.add(newUser);
            res.render('signIn/register',{
                title: 'Đăng ký',
                success: 'Đăng ký thành công (◕‿↼) '
            });

        }

    }

}

module.exports.logout =  (req,res) => {
    res.clearCookie('cookieID');
    res.redirect('/home');
}


module.exports.profile = async (req,res) => {
    if (req.signedCookies.cookieID === 'abcxyz') {
        const user =  await userModel.detail(id);
        res.render('user/profile', {title:'Profile', user});
    }
    else {
        res.redirect('/user/login');
    }
}
module.exports.modify = async (req,res,next) => {
    console.log(req.params.id);
    const user = await userModel.detail(id);

    res.render('user/userModify', {title: 'Chỉnh sửa', user});
}
exports.postModify = async(req,res,next) => {
    const form = formidable({multiple: true});

    await form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if (files.imageFile && files.imageFile.size> 0) {
            cloudinary.uploader.upload(files.imageFile.path,
                function(error, result) {
                    console.log(result, error);
                    fields.userImage = result.secure_url;
                    userModel.update(id, fields.userImage).then(res.redirect("/user/profile"));
                });
        }
        else {
            res.redirect("/user/profile");
        }
    });
}