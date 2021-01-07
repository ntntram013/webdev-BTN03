var express = require('express');
var router = express.Router();
const cartMiddleware = require('../middlewares/cart');

const cartController = require('../controllers/cartController');
/* GET home page. */

router.get('/',  cartController.detail );
router.get("/delete-item/:id", cartMiddleware.requireCart, cartController.deleteItem);
router.get("/delete", cartController.deleteCart);
router.get("/modify/:id", cartMiddleware.requireCart,cartController.modifyCart);
router.get("/merge", cartController.mergeCart);
module.exports = router;
