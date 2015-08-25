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