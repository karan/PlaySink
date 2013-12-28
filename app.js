var express = require('express');
var app = express();
var port = 1234;
var log = console.log;

// Connects to database (not working)
var mongo = require('mongodb');
var db = require('monk')('localhost/PlaySink');

// All enviroments ?need to figure out what this shit does
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express)
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));


// Homepage render
app.get('/', function(req, res) {
	res.render('index');

	// Trying to print all users in DB
	var c = db.usercollection.find();
	while (c.hasNext) {
		printjson(c.next());
	}
	log('hello');
});

// User attempts to login checks the details
app.post('/', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	// Prints username and password, page waits for response there is none.
	log(username + ' ' + password);
});

app.listen(port);
log('Listening on port ' + port);