var path = require('path');
var http = require('http')

var express = require('express');
var routes = require('./routes'); // import all routes

// Database connection
var mongo = require('mongodb');
var monk = require('monk'); // we use monk to interact with db
var db = monk('localhost:27017/playsinkdb'); // default port for mongo, db name

var app = express(); // create an express app

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'views')); // views folder
app.set('view engine', 'jade'); // using jade
app.use(express.favicon()); // favicon, can be changed
app.use(express.logger('dev')); // dev mode
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'))); // makes dirs look top-level

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/userlist', routes.userlist(db)); // pass db to userlist route
app.get('/newuser', routes.newuser);
app.post('/adduser', routes.adduser(db)); // POST to db

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
