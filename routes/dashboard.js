/*
	The dashboard aka main app.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');
var Constants = require('./../config/constants');

/*
	The main page of dashboard
	View: dashboard/dashboard
*/
exports.index = function(req, res) {
	user = req.user;
	res.render('dashboard/dashboard', {
		appName: Constants.APP_NAME,
		user: user,
		title: 'Dashboard'
	});
}

/*
	PUT the updated user info in db.
*/
exports.update_user = function(req, res) {

}