var path = require('path');
var http = require('http')

var passport = require('passport');
var express = require('express');
var routes = require('./routes'); // import all routes

// Database connection
var mongo = require('mongodb');
var monk = require('monk'); // we use monk to interact with db
var db = monk('localhost:27017/playsinkdb'); // default port for mongo, db name

var app = express(); // create an express app

// all environments
app.configure(function(){
  app.set('port', process.env.PORT || 8888);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/userlist', routes.userlist(db)); // pass db to userlist route
app.get('/newuser', routes.newuser);
app.post('/adduser', routes.adduser(db)); // POST to db


/*===== Error Handlers =====*/
app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  res.render('404', {url: req.url});
});

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.render('500')
});
/*===== Error Handlers =====*/


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
