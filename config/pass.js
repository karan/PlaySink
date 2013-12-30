var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, LocalStrategy) {

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
					return callback(null, false, {message: 'Username not found'});
				}

				// test for a matching password
				user.comparePassword(password, function(err, isMatch) {
					if (err) return callback(err);

					// check if password was a match
					if (isMatch) {
						return callback(null, user);
					}

					// password incorrect
					return callback(null, false, {message: 'Password not found'});
				});
			});
		}
	));
}