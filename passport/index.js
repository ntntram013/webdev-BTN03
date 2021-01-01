let passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const userService = require('../models/userService');

passport.use(new LocalStrategy({passReqToCallback: true},
    async (req, username, password, done) => {
        const user = await userService.checkCredential(username, password);
        if (user === -3) {
            return done(null, false, req.flash('err', 'Tài khoản đã bị khoá!'));
        }
        if (user === -2) {
            return done(null, false, req.flash('err', 'Tài khoản chưa được kích hoạt!'));
        }
        if (user === -1) {
            return done(null, false, req.flash('err', 'Mật khẩu không đúng!'));
        }
        if (user === 0) {
            return done(null, false, req.flash('err', 'Tài khoản không tồn tại!'));
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    // save _id to session
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userService.getUser(id).then((user) => {
        // get user from _id that is saved in session
        done(null, user);
    })
});

module.exports = passport;