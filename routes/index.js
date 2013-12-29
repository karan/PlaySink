//TODO Flash message doesn't show

var mongoose = require('mongoose');
var User = require('../models/User');

/*
	Homepage router.
	View: index
 */
exports.index = function(req, res){
	res.render('index', {title: 'Home'});
};

/*
	Will show a list of all users
	View: /users/userlist
*/
exports.userlist = function(req, res) {
	User.find(function(err, docs) { // docs stores the result of find
		res.render('users/userlist', {title: 'User List', 'userlist': docs});
	});
}

/*
	Handles sign up page.
	View: /users/signup
*/
exports.signup = function(req, res) {
	res.render('users/signup', {title: 'Sign Up', messages: req.flash('error')});
}

/*
	POST new user to db
	View: none
*/
exports.adduser = function(req, res) {

	// get the form values from "name" attribute
	var username = req.body.username;
	var email = req.body.useremail;
	var password = req.body.userpassword;

	var user = new User({
		'username': username,
		'password': password,
		'email': email
	});
	user.save(function(err) {
		if (err) {
			console.log(err);
			for (var field in err.errors) {
				var error = err.errors[field].message;
				req.flash('error', error);
			}
			res.redirect('/signup');
		} else {
			// success, so redirect to dashboard
			res.location('/dashboard'); // don't want address bar to say adduser anymore
			res.redirect('/dashboard');
		}
	});
}

/*
	Displays the signin page
	View: /users/signin
*/
exports.signin = function(req, res) {
	res.render('users/signin', {title: 'Sign In'});
}

/*
	Actually logs in the user
	view: /users/login
*/
exports.login = function(req, res) {
	res.render('login');
}

/*
	The dashboard aka main app.
*/
exports.dashboard = function(req, res) {
	res.render('dashboard');
}