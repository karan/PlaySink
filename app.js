//TODO Use passport-facebook to authenticate

/*===== require dependencies =====*/
var path = require('path');
var http = require('http')

var flash = require('connect-flash');
var routes = require('./routes');
var db = require('./models/db'); // Database connection

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var auth = require('./config/middlewares/authorization');
/*===== require dependencies =====*/

var app = express(); // create an express app

// configure environments
app.configure(function(){
	app.set('port', process.env.PORT || 8888);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser('keyboard cat'));
	app.use(express.session({ cookie: { maxAge: 60000 }}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/*===== URL Routers =====*/
app.get('/', routes.index);
app.get('/userlist', routes.userlist);

app.get('/signup', routes.signup);
app.post('/signup', routes.adduser);

app.get('/signin', routes.signin);
app.post('/signin', passport.authenticate('local', {successRedirect: '/dashboard', 
													failureRedirect: '/signin', 
													failureFlash: true}));

app.get('/logout', routes.logout);
app.get('/dashboard', auth.requiresLogin, routes.dashboard);
/*===== URL Routers =====*/

/*===== Error Handlers =====*/
app.use(function(req, res, next){
	// the status option, or res.statusCode = 404
	// are equivalent, however with the option we
	// get the "status" local available as well
	res.render('errors/404', {url: req.url});
});

app.use(function(err, req, res, next){
	// we may use properties of the error object
	// here and next(err) appropriately, or if
	// we possibly recovered from the error, simply next().
  res.render('errors/500')
});
/*===== Error Handlers =====*/

require('./config/pass.js')(passport, LocalStrategy);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
