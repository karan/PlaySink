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
	res.render('users/signin', {title: 'Sign In', messages: req.flash('error')});
}

/*
	Actually logs in the user
*/
exports.login = function(req, res) {
	// get the form fields
	var username = req.body.username;
	var password = req.body.userpassword;

	// try to get the user
	User.getAuthenticated(username, password, function(err, user, reason) {
		if (err) throw err;

		// login successful, redirect to dashboard
		if (user) {
			console.log(user.username + ' logged in.');
			res.location('/dashboard');
			res.redirect('/dashboard');
		} else {
			var reasons = User.failedLogin;
			console.log(reason);
			console.log(reasons);
			switch (reason) {
				// In production, do not tell user the reason for failed signin
				case 0:
					req.flash('error', 'Incorrect username.');
					break;
				case 1:
					req.flash('error', 'Incorrect password.');
					break;
				default:
					req.flash('error', 'Something went wrong.');
					break;
			}
			res.redirect('/signin');
		}
	});
}

/*
	Logout the user and redirect to homepage.
*/
exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
}

/*
	The dashboard aka main app.
*/
exports.dashboard = function(req, res) {
	user = req.user;
	console.log(user);
	res.render('dashboard', {user: user});
}