exports.login=(req,res,next) => {
    if(req.signedCookies.cookieID === 'abcxyz'){
        res.redirect('/users/id');
        return;
    }

    res.render('signIn/login',{
        title:'Đăng nhập'
    });
}

exports.register=(req,res,next) => {
    res.render('signIn/register', {
        title:'Đăng ký'
    });
}

module.exports.postLogin = (req,res)=>{
    const email = req.body.email;
    const pass = req.body.password;

    if(email !== 'user@gmail.com'){
        res.render('signIn/login',{
            title:'Đăng nhập',
            errors: [
                'Người dùng không tồn tại!'
            ],
        });
        return;
    }

    if(pass !== 'user'){
        res.render('signIn/login',{
            title:'Đăng nhập',
            errors: [
                'Mật khẩu không đúng!'
            ],
        });
        return;
    }

    res.cookie('cookieID','abcxyz',{
        signed:true,
        maxAge: 60*60*1000 // 60 minutes
    });


    res.redirect('/home');
}

module.exports.logout =  (req,res)=>{
    res.clearCookie('cookieID');
    res.redirect('/home');
}

module.exports.profile = (req,res) =>{
    if(req.signedCookies.cookieID === 'abcxyz'){
        res.render('user/profile', {
            title:'Profile'
        });
        return;
    }

    res.redirect('/users/login');
}