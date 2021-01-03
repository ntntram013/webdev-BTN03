const bcrypt = require('bcryptjs');
const formidable = require('formidable');
let cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET

})


const userModel = require('../models/userModel');
const userService = require('../models/userService');

module.exports.login = (req, res) => {
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

module.exports.register = (req, res) => {
    res.render('signIn/register', {
        title: 'Đăng ký'
    });
}

module.exports.postRegister = async (req, res) => {
    // create user & validate
    const {username, email, password, retypePassword} = req.body;
    let errors = [];

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
    // render errors msg
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
        // check if username or email exists
        const existedUser = userByEmail || userByUsername;
        if (existedUser) {
            res.render('signIn/register', {
                title: 'Đăng ký',
                username: username, email: email,
                errors: errors
            });
            return;
        } else {
            // add user to database
            const newUser = {username, email, password};
            const addedUser = await userModel.add(newUser);

            res.render('signIn/register', {
                title: 'Đăng ký',
                success: 'Đăng ký thành công (◕‿↼). Vui lòng xác thực email để '
            });
            // create confirmation link
            const url = process.env.URI_STORE_SERVER + '/user/confirm/' + addedUser.insertedId;
            let content = '';
            content += `
               <div style="padding: 10px; background-color: #b1bb88">
                    <div style="padding: 10px; background-color: #e8eae6;">
                        <h4 style="color: #576e4c">Konichiwa ~ (◕‿↼) . Cảm ơn bạn đã đến với TEAM 468 BOOKSTORE 🎉️</h4>
                        <span style="color: black">Ohlala, ai đó vừa tạo tài khoản phải không? Nhấn </span><a href="${url}">vào đây</a> để kích hoạt tài khoản nha.
                        <br><br><br>
                        <span style="color: #323232"><i>Nếu bạn không tạo tài khoản bằng địa chỉ này, xin hãy bỏ qua email này.</i><br>Thân ái.</span>
                         <br><br><br>
                        <span style="color: #8d8d8b">Gửi với ❤ từ TEAM 468 BOOKSTORE.</span>
                    </div>
               </div>
            `;
            const mainOptions = {
                from: '468-BOOKSTORE',
                to: email,
                subject: 'Xác Thực Tài Khoản | TEAM 468 BOOKSTORE',
                text: '',
                html: content
            }
            const config = {
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_SERVER,
                    pass: process.env.EMAIL_PASS
                }
            };
            await userService.sendMail(config, mainOptions);
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
        title: 'Hồ sơ',
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

module.exports.confirm = async (req, res) => {
    const userId = req.params.token;
    userModel.activateUser(userId).then(result => {
        const {matchedCount, modifiedCount} = result;
        if (matchedCount && modifiedCount) {
            res.render('signIn/confirm', {
                title: 'Xác thực email',
                success: 'Bạn đã xác thực email thành công. Hãy bắt đầu '
            });
        }
    }).catch(err => {
        res.render('signIn/confirm', {
            title: 'Xác thực email',
            errors: 'Có lỗi xảy ra. Thử lại sau nhé!'
        });
    });
}

module.exports.forgetPass = (req, res) => {
    res.render('signIn/forget-pass', {
        title: 'Quên mật khẩu',
        isGet: true,
        userFound: true
    });
}

module.exports.postForgetPass = async (req, res) => {
    const userEmail = req.body.email;
    const user = await userModel.queryUser('email', userEmail);
    if (user) {
        res.render('signIn/forget-pass', {
            title: 'Quên mật khẩu',
            isGet: false,
            userFound: true
        });
        // send reset password email to user
        const url = process.env.URI_STORE_SERVER + '/user/forget/' + user._id.toString();
        let content = '';
        content += `
               <div style="padding: 10px; background-color: #b1bb88">
                    <div style="padding: 10px; background-color: #e8eae6;">
                        <h4 style="color: #576e4c">¡Hola (•‿•) ~ Có phải bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản <span style="color: #6a0026">${user.username}</span>?</h4>
                        <span style="color: black">Ai đó thật đãng trí nhỉ? Nhấn </span><a href="${url}">vào đây</a> để đặt mật khẩu mới nhé.
                        <br><br><br>
                        <span style="color: #323232"><i>Nếu bạn không yêu cầu đặt lại mật khẩu, xin hãy bỏ qua email này.</i><br>Thân ái.</span>
                         <br><br><br>
                        <span style="color: #8d8d8b">Gửi với ❤ từ TEAM 468 BOOKSTORE.</span>
                    </div>
               </div>
            `;
        const mainOptions = {
            from: '468-BOOKSTORE',
            to: userEmail,
            subject: 'Đặt Lại Mật Khẩu | TEAM 468 BOOKSTORE',
            text: '',
            html: content
        }
        const config = {
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_SERVER,
                pass: process.env.EMAIL_PASS
            }
        };
        await userService.sendMail(config, mainOptions);
    } else {
        res.render('signIn/forget-pass', {
            title: 'Quên mật khẩu',
            isGet: true,
            userFound: false
        });
    }
}

module.exports.resetPass = async (req, res) => {
    const userId = req.params.token;
    await userModel.detail(userId).then(result => {
        res.render('signIn/reset-pass', {
            title: 'Đặt lại mật khẩu',
            isGet: true
        });
    }).catch(err => {
        res.render('signIn/reset-pass', {
            title: 'Đặt lại mật khẩu',
            isGet: true,
            errors: 'Có lỗi xảy ra. Thử lại sau nhé!'
        });
    });
}

module.exports.postResetPass = async (req, res) => {
    const {password, retypePassword} = req.body
    let errors = [];
    if (password === retypePassword) {
        const userId = req.params.token
        const hashedPassword = await userService.hashPass(password);
        userModel.updateByQuery(userId, 'password', hashedPassword).then(result => {
            const {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                res.render('signIn/reset-pass', {
                    title: 'Đặt lại mật khẩu',
                    isGet: false,
                });
            }
        });
        return;
    } else if (password.length < 5) {
        errors.push('Mật khẩu phải ít nhất 5 ký tự!');
    } else {
        errors.push('Mật khẩu không khớp. Vui lòng nhập lại.');
    }
    res.render('signIn/reset-pass', {
        title: 'Đặt lại mật khẩu',
        isGet: true,
        validateErrors: errors
    });
}