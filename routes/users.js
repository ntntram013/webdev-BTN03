var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
/* GET users listing. */
router.get('/login', userController.login);
router.get('/register', userController.register);

module.exports = router;
