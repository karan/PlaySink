/*
	All our routes.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');
var Constants = require('./../config/constants');


var today = new Date(), // returns ISODate
	today_ms = today.getTime(), // returns milliseconds
	yesterday_ms = today_ms - (24 * 60 * 60 * 1000), // milliseconds 24 hours ago
	yesterday = new ISODate(new Date(yesterday_ms).toISOString()); // yesterday as ISODate

/*
	Admin Homepage router.
	View: admin/index
*/
exports.index = function(req, res){
	user_count.all_time(function(count) {
		res.render('admin/index', {
			appName: Constants.APP_NAME, 
			title: 'Admin',
			total_users: count
		})
	})
};


/*
	Methods that return user counts.
*/
var user_count = {
	all_time: function(next) {
		User.count({}, function (err, count) {
			if (!err) {
				next(count);
			}
		});
	},
	past_day: function(next) {
		User.count({'created_at': {$gte: yesterday}}, function(err, count) {
			if (!err) {
				next(count);
			}
		});
	}
}