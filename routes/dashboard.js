/*
	The dashboard aka main app.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');

/*
	The main page of dashboard
	View: dashboard/dashboard
*/
exports.index = function(req, res) {
	user = req.user;
	res.render('dashboard/dashboard', {
		user: user,
		title: 'Dashboard'
	});
}

/*
	PUT the updated user info in db.
*/
exports.update_user = function(req, res) {
	var user = new User({
		'username' : req.user.username,
		'password': req.body.newuserpassword || req.locals.user.password,
		'email': req.body.newuseremail
	});

	console.log(user);

	user.save(function(err) {
		if (err) {
			console.log(err);
			for (var field in err.errors) {
				var error = err.errors[field].message;
				req.flash('error', error);
			}
			res.redirect('/dashboard');
		} else {
			req.logIn(user, function (err) {
				if (!err) {
					req.flash('success', 'Done!');
				} else {
					req.flash('error', 'Something went wrong.');
				}
			});
		}
	});
}