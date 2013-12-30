var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

module.exports = function (passport, LocalStrategy) {

	var reasons = User.failedLogin;

	// This lets authentication know how it should store
	// and grab users from a request to pass to a mapping
	// function.
	passport.serializeUser(function (user, done) {
		console.log('serializing: ' + user);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		console.log('deserializing: ' + id);
		User.findOne({ _id: id }, function (err, user) {
			done(err, user);
		});
	});


	// Local username/password login
	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'userpassword'
	}, function(username, password, callback) {
			console.log('authenticating.. : ' + username)
			User.findOne({username: username}, function(err, user) {
				if (err) return callback(err);

				// make sure the user exists
				if (!user) {
					return callback(null, false, {message: reasons.NOT_FOUND});
				}

				// test for a matching password
				user.comparePassword(password, function(err, isMatch) {
					if (err) return callback(err);

					// check if password was a match
					if (isMatch) {
						console.log('found user, and returned')
						return callback(null, user);
					}

					// password incorrect
					return callback(null, false, {message: reasons.PASSWORD_INCORRECT});
				});
			});
		}
	));
}