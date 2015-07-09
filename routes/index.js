var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Primera prueba QUIZ !' });
});

router.get('/author',function(req,res) {
	res.render('author', {title: 'Cŕeditos de la página'});
});
module.exports = router;
