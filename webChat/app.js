var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var http = require('http');
// app.set('port', process.env.PORT || 3000);
// http.createServer(app).listen(app.get('port'), function(req, res){
//   console.log('Express server listening on port ' + app.get('port'));
// });

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg, d){
    console.log('message: ' + msg + ' time: ' + d);
    io.emit('chat message', msg, d);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// var sqlite3 = require('sqlite3').verbose();
// var url = require('url');
// var db2 = new sqlite3.Database('./user_chat1.db');
// var fs = require('fs');
// var exists2 = fs.existsSync('./user_chat1.db');
// db2.serialize(function(){
//   // db2.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value TEXT)");
//   // db2.run("INSERT INTO counts (key, value) VALUES(?, ?)", "counter", 0);
//   if (!exists2)
//     db2.run("CREATE TABLE user_chat1 (content TEXT) ");
//     // db2.run("CREATE TABLE user_chat (name TEXT, content TEXT, time TEXT) ");
// });

// var add_todo = "INSERT INTO user_chat1 VALUES (?)";
// app.get('/chat', function(req, res){
//   u=url.parse(req.url, true);
//   // res.writeHead(200, {'Content-Type': 'application/json'});
//   // if (u.path==)
//   console.log('u: ' + u + ' u.query[]: ' + u.query['description']);
//   if (typeof u.query['description']!=='undefined')
//   {
//       db2.run(add_todo, u.query['description']);
//       db2.get('SELECT last_insert_rowid() as id', function(err, row){
//           res.end(u.query['callback'] + "({ msg: 'success', id: '" + row['id'] + "'})");
//           console.log("New Todo: " + u.query['description']); 
//       });
//   }

// });


http.listen(3000, function(){
  console.log('listening on *: 3000');
});


var routes = require('./routes/index');
var users = require('./routes/users');



// view engine setup
var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
