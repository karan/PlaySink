/*
    Module dependencies
*/

var express = require('express'),       // the main ssjs framework
    routes = require('./routes'),       // by default, brings in routes/index.js
    admin = require('./routes/admin'),  // all login for admin panel
    user = require('./routes/user'),  // all login for admin panel
    dashboard = require('./routes/dashboard'), // the main app's page
    path = require('path'),             // for pathn manipulation
    flash = require('connect-flash'),   // to use re.flash()
    db = require('./config/db'),        // database connection
    passport = require('passport'),     // for user authentication
    auth = require('./config/middlewares/authorization'), // helper methods for authentication
    constants = require('./config/constants'),
    app = express(),                    // create an express app
    RedisStore = require('connect-redis')(express); // for persistent sessions

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
    app.use(express.session({ 
        secret: 'keyboard cat',
        maxAge: new Date(Date.now() + 3600000),
        store: new RedisStore({
            host: 'localhost',
            port: 6379,
            db: 2
        })
    }));
    // so we can use req.flash() to flash messages
    app.use(flash());
    // initialize passport
    app.use(passport.initialize());
    // for persistent session logins otherwise each request would need credentials
    app.use(passport.session());
    // make variables available in all templates, provided that req.user is populated.
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        res.locals.appName = constants.APP_NAME;
        next();
    });
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
app.get('/signup', user.signup); // the signup page
app.post('/signup', user.adduser); // signup page send a POST request here

// signin/out
app.get('/signin', user.signin); // the signin page
app.post('/signin', passport.authenticate('local'), function (req, res) {
    // responds with 401 if unauthorized
    var tmp = req.session.redirect_to ? req.session.redirect_to : '/signin';
    delete req.session.redirect_to;
    res.redirect(tmp);
})
app.get('/logout', auth.requiresLogin, user.logout);

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

// Soundcloud auth
app.get('/auth/soundcloud', passport.authenticate('soundcloud'));
app.get('/auth/soundcloud/callback', // Goes to dashboard if it works
        passport.authenticate('soundcloud',{ 
            successRedirect: '/dashboard',
            failureRedirect: '/signin',
            failureFlash: 'This account seems to be in use.'
        })
);

// user areas

// account management
app.post('/dashboard/update', auth.requiresLogin, user.update_user); 
app.post('/dashboard/put_likes', auth.requiresLogin, user.put_likes);

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
        appName: constants.APP_NAME,
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


// Creates the server and has socets listen to it
app.listen(app.get('port')), { log: false};
//var io = require('socket.io').listen(app.listen(app.get('port')), { log: false});

/*
    Start of sockets


io.sockets.on('connection', function(socket) {
    console.log('Starting socket connection');

    // Need to figure out if we can put the name on the socket
    socket.on('setUser', function() {
        console.log('Connected with client');
    });

    // Can get the username through the user field
    // probably not the best method
    socket.on('send message', function(data) {
        socket.user = data.user;
        io.sockets.emit('update message', data);
    });

    socket.on('disconnect', function() {
        console.log(socket.user + ' disconnected');
    });
});
*/
console.log('Express server listening on port ' + app.get('port'));
