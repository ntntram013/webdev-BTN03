var express = require('express');
var router = express.Router();

const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');

/* GET list of goods. */
router.get('/', bookController.pagination);
router.get('/:id', bookController.detail);
router.get('/add-to-cart/:id', cartController.addToCart );
router.post('/:id/add-comment', bookController.addComment);

module.exports = router;
