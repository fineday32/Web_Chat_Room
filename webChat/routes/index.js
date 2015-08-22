var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'ExpressTT' });
// });



router.get('/', function(req, res){
	res.render('index', {
		title:'FSE Chat Room'
	});
})

module.exports = router;