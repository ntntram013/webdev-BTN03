var express = require('express');
var router = express.Router();

const bookController = require('../controllers/bookController');

/* GET list of goods. */
router.get('/', bookController.index);
router.get('/:id', bookController.detail);


module.exports = router;
