var express = require('express');
var app = express();
var port = 1234;
var log = console.log;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express)
app.use(express.bodyParser());
app.use(express.cookieParser());
//app.use(express.static(__dirname + '/public'));


// Homepage render
app.get('/', function(req, res) {
	res.render('index');
});

app.post('/', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	log(username + ' ' + password);
});

app.listen(port);
log('Listening on port ' + port);