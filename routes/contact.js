var express = require('express');
var router = express.Router();


router.get('/',  (req, res) => {
    res.render('contact', {title: 'Liên hệ'});
});


module.exports = router;
