var express = require('express');
var router = express.Router();

var fs = require('fs');
// var file = './test.db';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./user_name.db');
var db2 = new sqlite3.Database('./user_chat.db');
var exists1 = fs.existsSync('./user_name.db');
var exists2 = fs.existsSync('./user_chat.db');
var nowUser = "";

db.serialize(function(){
	// db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value TEXT)");	
	// db.run("INSERT INTO counts (key, value) VALUES(?, ?)", "counter", 0);
	if (!exists1)
		db.run("CREATE TABLE user_name (name TEXT)");
});

db2.serialize(function(){
	// db2.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value TEXT)");
	// db2.run("INSERT INTO counts (key, value) VALUES(?, ?)", "counter", 0);
	if (!exists2)
		db2.run("CREATE TABLE user_chat (name TEXT, content TEXT) ");
});

router.post('/', function(req, res){	
	console.log('req username : ' + req.body.username);
	nowUser = req.body.username;
	var stmt = db.prepare("INSERT INTO user_name VALUES (?)");
	stmt.run(req.body.username);
	stmt.finalize();
	res.redirect('/chat');
	res.end();
});

router.post('/chat', function(req, res){
	console.log('req user_chat_content : ' + req.body.chat_content);
	var stmt = db2.prepare("INSERT INTO user_chat VALUES (?, ?)");
	stmt.run(nowUser, req.body.chat_content);
	stmt.finalize();
	res.redirect('/chat');
	res.end();
});


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'ExpressTT' });
// });

router.get('/', function(req, res){
	res.render('index', {
		title:'FSE Chat Room'
	});

});

router.get('/chat', function(req, res){
	res.render('chat', {
		title:'FSE Chat Room'
	});
	// db.get("SELECT value from counts", function(err, row){
	// 	res.json({"count " : row.value});
	// });
});




module.exports = router;