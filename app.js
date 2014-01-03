/*
	Module dependencies
*/

var express = require('express'),		// the main ssjs framework
	routes = require('./routes'),		// by default, brings in routes/index.js
	admin = require('./routes/admin'),  // all login for admin panel
	dashboard = require('./routes/dashboard'), // the main app's page
	path = require('path'),				// for pathn manipulation
	flash = require('connect-flash'),	// to use re.flash()
	db = require('./models/db'),		// database connection
	passport = require('passport'),		// for user authentication
	auth = require('./config/middlewares/authorization'), // helper methods for authentication
	app = express(); 					// create an express app

/*
	Configure environments
*/

app.configure(function(){
	// read port from .env file
	app.set('port', process.env.PORT || 8888);
	// locate the views folder
	app.set('views', __dirname + '/views');
	// we are using jade templating engine
	app.set('view engine', 'jade');
	// the favicon to use for our app
	app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
	// watch network requests to express in realtime
	app.use(express.logger('dev'));
	// allows to read values in a submitted form
	app.use(express.bodyParser());
	// faux HTTP requests - PUT or DELETE
	app.use(express.methodOverride());
	// every file <file> in /public is served at example.com/<file>
	app.use(express.static(path.join(__dirname, 'public')));
	// sign the cookies, so we know if they have been changed
	app.use(express.cookieParser('keyboard cat'));
	// setup cookie session, cookie expires in 1 day (in ms)
	app.use(express.session({ cookie: {maxAge: 1 * 24 * 60 * 60 * 1000}}));
	// so we can use req.flash() to flash messages
	app.use(flash());
	// initialize passport
	app.use(passport.initialize());
	// for persistent session logins otherwise each request would need credentials
	app.use(passport.session());
	// invokes the routes' callbacks
	app.use(app.router);
});


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/*
	URL routes
*/

// homepage
app.get('/', routes.index);
app.get('/userlist', auth.requiresLogin, routes.userlist);

// signup
app.get('/signup', routes.signup); // the signup page
app.post('/signup', routes.adduser); // signup page send a POST request here

// signin/out
app.get('/signin', routes.signin); // the signin page
app.post('/signin', // signin page send a POST request here
		passport.authenticate('local', {
			successRedirect: '/dashboard', 
			failureRedirect: '/signin', 
			failureFlash: 'Invalid username or password.'
		})
);
app.get('/logout', routes.logout);

// social signin
// Passport redirects to a facebook login and we ask only for email
app.get('/auth/facebook', passport.authenticate("facebook", {scope:'email'}));
app.get('/auth/facebook/callback', // Authenticates it and sends to dashboard
        passport.authenticate('facebook',{ 
        	successRedirect: '/dashboard',
        	failureRedirect: '/signin',
        	failureFlash: 'This account seems to be in use.'
        })
);

// Passport redirects to twitter login
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', // If it works, will send to dashboard
        passport.authenticate('twitter',{ 
        	successRedirect: '/dashboard',
        	failureRedirect: '/signin',
        	failureFlash: 'This account seems to be in use.'
        })
);

// Same thing as other two just with google
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback', // Goes to dashboard if it works
        passport.authenticate('google',{ 
        	successRedirect: '/dashboard',
        	failureRedirect: '/signin',
        	failureFlash: 'This account seems to be in use.'
        })
);

// user areas
// where all the fun happens
app.get('/dashboard', auth.requiresLogin, dashboard.index); 



// admin panel
app.get('/admin', admin.index);
app.get('/admin/users', admin.users);

/*
* Error handlers
*/

app.use(function(req, res, next){
	res.render('errors/404', {
		url: req.url, 
		appName: require('./config/constants').APP_NAME,
		title: '404 Not Found'
	});
});

app.use(function(err, req, res, next){
  res.render('errors/500')
});

/*
	load helper methods for passport.js
	this is at the end to ensure everything has been loaded/required
*/
require('./config/pass.js')(passport);

// create and start the server
app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
