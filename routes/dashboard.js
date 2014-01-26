/*
	The dashboard aka main app.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');

/*
	Renders the main page of dashboard
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
	Returns {'response': 'OK', user: {...}} if successful,
	{'response': 'FAIL'} if signup failed.
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
