let passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const userService = require('../models/userService');

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const user = await userService.checkCredential(username,password);
        if(!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userService.getUser(id).then((user)=>{
        done(null, user);
    })
});

module.exports = passport;