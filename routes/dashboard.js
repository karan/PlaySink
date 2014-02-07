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
	POST the updated user info in db.
	Returns {'response': 'OK', user: {...}} if successful,
	{'response': 'FAIL'} if signup failed.
*/
exports.update_user = function(req, res) {
	User.findById(req.user.id, function(error, doc) {
		if (error) {
			res.json({'response': 'FAIL', 'errors': []});
		} else {
			console.log(doc);

			doc.password = req.body.newuserpassword || '';
			doc.email = req.body.newuseremail || '';

			console.log(doc);

			doc.save(function(err) {
				if (err) {
					console.log(err);
					var fail_msgs = [];
					for (var field in err.errors) {
						fail_msgs.push(err.errors[field].message);
					}
					res.json({'response': 'FAIL', 'errors': fail_msgs});
				} else {
					res.json({'response': 'OK', 'user': doc});
				}
			});
		}
	})

}
