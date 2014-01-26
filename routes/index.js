/*
	All our routes.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');

/*
	Homepage router. Simply renders the homepage.
	View: index
*/
exports.index = function(req, res){
	// otherwise, render the page
	res.render('index', {title: 'Home'});
};

/*
	Renders the userlist page.
	View: userlist
*/
exports.userlist = function(req, res) {
	User.find(function(err, docs) { // docs stores the result of find
		res.json({ 'title': 'User List', 'userlist': docs });
	});
}

/*
	Renders the signup page.
	View: /users/signup
*/
exports.signup = function(req, res) {
	// is a user is already logged in, take him to dashboard
	if (req.isAuthenticated()) res.redirect('dashboard');
	// otherwise, render the page
	res.render('users/signup', {
		title: 'Sign Up',
		messages: req.flash('error')
	});
}

/*
	Renders the signin page. Signin form is on homepage.
	View: users/signin
*/
exports.signin = function(req, res) {
	// is a user is already logged in, take him to dashboard
	if (req.isAuthenticated()) res.redirect('dashboard');
	// otherwise, render the page
	res.render('users/signin', {
		title: 'Sign In',
		messages: req.flash('error')
	});
}

/*
	POST new user to db.
	Returns {'response': 'OK', user: {...}} if successful,
	{'response': 'FAIL'} if signup failed.
*/
exports.adduser = function(req, res) {
	// get the form values from "name" attribute of the form
	var user = new User({
		'username': req.body.username,
		'password': req.body.userpassword,
		'email': req.body.useremail,
		'strategy': 'local'
	});

	console.log(user.username);

	user.save(function(err) {
		if (err) {
			console.log(err);
			var fail_msgs = [];
			for (var field in err.errors) {
				fail_msgs.push(err.errors[field].message);
			}
			res.json({'response': 'FAIL', 'errors': fail_msgs});
		} else {
			req.logIn(user, function (err) {
				// successful registration
				res.json({'response': 'OK', 'user': user});
			});
		}
	});
}

/*
	Logout the user and redirect to homepage.
*/
exports.logout = function(req, res) {
	if (req.isAuthenticated()) req.logout();
	res.json({'response': 'OK'});
}
