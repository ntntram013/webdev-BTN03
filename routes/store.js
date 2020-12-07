var express = require('express');
var router = express.Router();

const bookController = require('../controllers/bookController');

/* GET list of goods. */
router.get('/', bookController.pagination);
router.get('/:id', bookController.detail);


module.exports = router;
