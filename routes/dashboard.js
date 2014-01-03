/*
	The dashboard aka main app.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');
var Constants = require('./../config/constants');

/*
	The main page of dashboard
	View: dashboard
*/
exports.index = function(req, res) {
	user = req.user;
	res.render('dashboard', {
		appName: Constants.APP_NAME,
		user: user,
		title: 'Dashboard'
	});
}