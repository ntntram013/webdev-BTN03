var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');


/* GET users listing. */
router.get('/login', userController.login);

router.get('/register', userController.register);

router.post('/login', userController.postLogin);

router.get('/id', userController.profile);

router.get('/logout', userController.logout);

module.exports = router;
