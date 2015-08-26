var fs = require('fs');
var file = './test.db';
var exists = fs.existsSync(file);

//load sqlite3
var sqlite3 = require('sqlite3').verbose();
//new a sqlite database, named test.db
var db = new sqlite3.Database(file);

db.serialize(function(){

	db.run('Create table if not exists stuff(thing TEXT)');
	var stmt = db.prepare('Insert into stuff values (?)');

	//write data
	for (var i=0; i<10; i++)
	{
		var rnd;
		rnd = Math.floor(Math.random()*1000);
		stmt.run('staff_number ' + rnd);
	}
	stmt.finalize();
	db.each('Select rowid AS id, thing from stuff', function(err, row){
		console.log(row.id + ": " + row.thing);
	})
	db.close();
});


var add = 
    		'<div class="row chat-content-block">'+
				'<div class="col-xs-8 col-sm-9">'+
					'<h3 class="chat-content-username">name</h3>'+
					'<h4 class="chat-content-content">content</h4>'+
				'</div>'+
				'<div class="col-xs-4 col-sm-3">'+
					'<h5 class="chat-content-time"><%= post.time %></h5>'+
				'</div>'+
			'</div>'+
			'<p class="chat-content-interval"></p>';
		console.log('add is ' + add);
		$('#add-chat-content-block').append($('<li>').text(msg));
    	$('#add-chat-content-block').append(add);