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
	View: newuser
*/
exports.newuser = function(req, res) {
	res.render('newuser', {title: 'Sign Up'});
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

	User.create({
		'username': username,
		'password': password,
		'email': email
	}, function(err, user) {
		if (err) {
			// if it failed
			res.send('Problem adding to DB');
		} else {
			console.log(user);
			// success, so redirect to userlist
			res.location('userlist'); // don't want address bar to say adduser anymore
			res.redirect('userlist');
		}
	})
}