var mongoose = require('mongoose');
var User = require('../models/User');

/*
	Homepage router.
	View: index
 */
exports.index = function(req, res){
	res.render('index', { title: 'PlaySink' });
};

/*
	Will show a list of all users
	View: userlist
*/
exports.userlist = function(req, res) {
	User.find(function(err, docs) { // docs stores the result of find
		res.render('userlist', {'userlist': docs});
	});
}

/*
	Handles sign up page.
	View: signup
*/
exports.signup = function(req, res) {
	res.render('signup', {title: 'Sign Up'});
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

	//TODO: Validate email
	//TODO: Flash messages
	// Check if username exists
	User.findOne({'username': username}, function(err, user) {
		if (user) {
			console.log('user exists');
			//req.flash('error', 'Username exists');
			res.redirect('signup');
		} else {
			console.log('user does NOT exists');
			var user = new User({
				'username': username,
				'password': password,
				'email': email
			});
			user.save(function(err) {
				if (err) {
					// if it failed
					console.log('something went wrong..');
					res.redirect('/signup');
				} else {
					// success, so redirect to dashboard
					res.location('dashboard'); // don't want address bar to say adduser anymore
					res.redirect('dashboard');
				}
			});
		}
	});
}

/*
	Displays the signin page
	View: signin
*/
exports.signin = function(req, res) {
	res.render('signin', {title: 'Sign In'});
}

/*
	Actually logs in the user
	view: login
*/
exports.login = function(req, res) {
	res.render('login');
}

exports.dashboard = function(req, res) {
	res.render('dashboard');
}