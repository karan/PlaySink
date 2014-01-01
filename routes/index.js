/*
	All our routes.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');
var Constants = require('./../config/constants');

/*
	Homepage router.
	View: index
*/
exports.index = function(req, res){
	// is a user is already logged in, take him to dashboard
	if (req.isAuthenticated()) res.redirect('dashboard');
	// otherwise, render the page
	res.render('index', {appName: Constants.APP_NAME, title: 'Home', user: req.user});
};

/*
	Will show a list of all users
	View: userlist
*/
exports.userlist = function(req, res) {
	User.find(function(err, docs) { // docs stores the result of find
		res.render('userlist', {
			appName: Constants.APP_NAME,
			title: 'User List',
			'userlist': docs,
			user: req.user
		});
	});
}

/*
	Handles sign up page.
	View: /users/signup
*/
exports.signup = function(req, res) {
	// is a user is already logged in, take him to dashboard
	if (req.isAuthenticated()) res.redirect('dashboard');
	// otherwise, render the page
	res.render('users/signup', {
		appName: Constants.APP_NAME,
		title: 'Sign Up',
		messages: req.flash('error')
	});
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
		'email': email,
		'strategy': 'local'
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
			req.logIn(user, function (err) {
				if (!err) {
					// success, so redirect to dashboard
					res.location('/dashboard'); // don't want address bar to say adduser anymore
					res.redirect('/dashboard');
				} else {
					req.flash('error', 'Registration successful. Sign In.');
				}
			});
		}
	});
}

/*
	Signin form is on homepage and on /signin
	View: users/signin
*/
exports.signin = function(req, res) {
	// is a user is already logged in, take him to dashboard
	if (req.isAuthenticated()) res.redirect('dashboard');
	// otherwise, render the page
	res.render('users/signin', {
		appName: Constants.APP_NAME,
		title: 'Sign In',
		messages: req.flash('error')
	});
}

/*
	Logout the user and redirect to homepage.
*/
exports.logout = function(req, res) {
	if (req.isAuthenticated()) req.logout();
	res.redirect('/');
}

/*
	The dashboard aka main app.
*/
exports.dashboard = function(req, res) {
	user = req.user;
	res.render('dashboard', {
		appName: Constants.APP_NAME,
		user: user,
		title: 'Dashboard'
	});
}