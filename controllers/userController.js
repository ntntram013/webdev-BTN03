exports.login=(req,res,next) =>
{
    res.render('signIn/login',{title:'Đăng nhập'});
}
exports.register=(req,res,next) =>
{
    res.render('signIn/register', {title:'Đăng ký'});
}