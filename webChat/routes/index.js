var express = require('express');
var router = express.Router();

var fs = require('fs');
// var file = './test.db';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./user_name.db');
var db2 = new sqlite3.Database('./user_chat.db');
var exists1 = fs.existsSync('./user_name.db');
var exists2 = fs.existsSync('./user_chat.db');

db.serialize(function(){
	// db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value TEXT)");	
	// db.run("INSERT INTO counts (key, value) VALUES(?, ?)", "counter", 0);
	if (!exists1)
		db.run("CREATE TABLE user_name (thing TEXT)");
});

db2.serialize(function(){
	// db2.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value TEXT)");
	// db2.run("INSERT INTO counts (key, value) VALUES(?, ?)", "counter", 0);
	if (!exists2)
		db2.run("CREATE TABLE user_chat (thing TEXT)");
});

router.post('/', function(req, res){
	
	// db.run(htmlspecialchars($_POST[$variableName]));
	console.log('req username : ' + req.body.username);
	var stmt = db.prepare("INSERT INTO user_name VALUES (?)");
	stmt.run(req.body.username);
	stmt.finalize();
	res.redirect('/chat');
	res.end();
	
});

router.post('/chat', function(req, res){
	db2.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
		if (err)
		{
			console.err(err);
			res.status(500);
		}
		else
		{
			console.log("save user_chat_data to db");
			res.status(202);
		}
		res.redirect('/chat');
		res.end();
	});
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