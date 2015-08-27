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
		db2.run("CREATE TABLE user_chat (name TEXT, content TEXT, time TEXT) ");
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

/*
router.post('/chat', function(req, res){
	var stmt = db2.prepare("INSERT INTO user_chat VALUES (?, ?, ?)");
	//set now's time
	var date = new Date();
	var hour =  date.getHours();
	var tz = "AM";
	if (hour>=12)
	{
		hour -= 12;
		tz = "PM";
	}
	var d = (date.getMonth()+1) + '.' + date.getDate() + '.' + date.getFullYear() + ' ' + hour + ':' + date.getMinutes()  + tz;
	console.log('req user_chat_content : ' + req.body.chat_content + 
		'\n' + 'date : ' + d);

	stmt.run(nowUser, req.body.chat_content, d);
	stmt.finalize();
	res.redirect('/chat');
	res.end();
});
*/

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'ExpressTT' });
// });

router.get('/', function(req, res){
	res.render('index', {
		title:'FSE Chat Room'
	});

});

var url = require('url');
var add_todo = "INSERT INTO user_chat VALUES (?, ?, ?)";
router.get('/chat', function(req, res){

	u = url.parse(req.url, true);
	console.log('u: ' + u + ' u.query[]: ' + u.query['description']);
	
	//set now's time
	var date = new Date();
	var hour =  date.getHours();
	var tz = "AM";
	if (hour>=12)
	{
		hour -= 12;
		tz = "PM";
	}
	var d = (date.getMonth()+1) + '.' + date.getDate() + '.' + date.getFullYear() + ' ' + hour + ':' + date.getMinutes()  + tz;
	// console.log('req user_chat_content : ' + req.body.chat_content + '\n' + 'date : ' + d);
	var callback_content = u.query['description'];
	console.log('callback_content: ' + callback_content);
	if (typeof(callback_content)!=="undefined")
		db2.run(add_todo, nowUser, u.query['description'], d);
	
	var posts = [];
	db2.serialize(function(err, row){
		db2.each('SELECT * FROM user_chat', function(err, row){
			console.log('posts.push ' + row.name + ' ' + row.content)
			posts.push({name: row.name, content: row.content, time: row.time});
		}, function(){
			//All done fetching records, render response
			res.render('chat', {
				title:'FSE Chat Room',
				posts: posts
				,nowUser: nowUser
			});
		});
		
	})
	
});




module.exports = router;