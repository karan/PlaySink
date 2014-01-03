/*
	All our routes.
*/

var mongoose = require('mongoose');
var User = require('./../models/user');
var Constants = require('./../config/constants');
var async = require('async');


var today = new Date(), // returns ISODate
	today_ms = today.getTime(), // returns milliseconds
	yesterday_ms = today_ms - (24 * 60 * 60 * 1000), // milliseconds 24 hours ago
	yesterday = new Date(new Date(yesterday_ms).toISOString()), // yesterday as ISODate
	week_ms = today_ms - (7 * 24 * 60 * 60 * 1000),
	week = new Date(new Date(week_ms).toISOString()),
	month_ms = today_ms - (30 * 24 * 60 * 60 * 1000), // 30 days for now
	month = new Date(new Date(month_ms).toISOString());

/*
	Admin Homepage router.
	View: admin/index
*/
exports.index = function(req, res){
	async.parallel({ // https://github.com/caolan/async#parallel
			// counts number of users in date ranges
			all_time: function(next) {
				User.count({}, function (err, count) {
					if (!err) {
						next(null, count);
					}
				});
			},
			past_day: function(next) {
				User.count({'created_at': {$gte: yesterday}}, function(err, count) {
					if (!err) {
						next(null, count);
					}
				});
			},
			week: function(next) {
				User.count({'created_at': {$gte: week}}, function(err, count) {
					if (!err) {
						next(null, count);
					}
				});
			},
			month: function(next) {
				User.count({'created_at': {$gte: month}}, function(err, count) {
					if (!err) {
						next(null, count);
					}
				});
			},
			// Counts number of user signups for each strategy
			local: function(next) {
				User.count({'strategy': 'local'}, function(err, count) {
					if (!err) {
						next(null, count);
					}
				});
			},
			google: function(next) {
				User.count({'strategy': 'google'}, function(err, count) {
					if (!err) {
						next(null, count);
					}
				});
			},
			facebook: function(next) {
				User.count({'strategy': 'facebook'}, function(err, count) {
					if (!err) {
						next(null, count);
					}
				});
			},
			twitter: function(next) {
				User.count({'strategy': 'twitter'}, function(err, count) {
					if (!err) {
						next(null, count);
					}
				});
			}
		}, 
		function(err, r) {
			res.render('admin/index', {
				appName: Constants.APP_NAME, 
				title: 'Admin',
				total_users: r.all_time,
				yesterday: r.past_day,
				week: r.week,
				month: r.month,
				local: r.local,
				google: r.google,
				facebook: r.facebook,
				twitter: r.twitter
			})
		}
	);
}