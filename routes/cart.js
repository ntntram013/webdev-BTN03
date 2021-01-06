var express = require('express');
var router = express.Router();

const cartController = require('../controllers/cartController');
/* GET home page. */

router.get('/', cartController.detail );
router.get("/delete-item/:id", cartController.deleteItem);
router.get("/delete", cartController.deleteCart);
router.get("/modify/:id", cartController.modifyCart);
module.exports = router;
