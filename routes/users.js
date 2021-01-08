var express = require('express');
var router = express.Router();

const passport = require('../passport');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.get('/login', userController.login);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/cart/merge',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.get('/confirm/:token', userController.confirm);

router.get('/forget', userController.forgetPass);
router.post('/forget', userController.postForgetPass);
router.get('/forget/:token', userController.resetPass);
router.post('/forget/:token', userController.postResetPass);

router.get('/register', userController.register);
router.post('/register', userController.postRegister);

router.get('/logout', userController.logout);
router.get('/change-pass',  authMiddleware.requireAuth,(req, res) => {
    res.render('user/change-pass', {title: 'Đổi mật khẩu'});
});
//router.get('/change-pass', );
router.post('/change-pass',  authMiddleware.requireAuth, userController.postChangePass);
router.get('/profile/modify', authMiddleware.requireAuth, userController.modify);
router.post('/profile/modify', authMiddleware.requireAuth, userController.postModify);
router.get('/profile', authMiddleware.requireAuth, userController.profile);


module.exports = router;
