module.exports.requireAuth = (req,res,next)=>{
    if (!req.user) {
        res.redirect('/user/login');
        return;
    }
    next();
};