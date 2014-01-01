/*
	This is a wrapper for all code used for user authentication.
*/

// bring in the schema for user
var User = require('mongoose').model('User');
var FBUser = require('mongoose').model('FBS');	// Facebook Users
var TWUser = require('mongoose').model('TWS');	// Twitter Users

module.exports = function (passport, LocalStrategy, FacebookStrategy,
							TwitterStrategy, GoogleStrategy) {

	/*
 		user ID is serialized to the session. When subsequent requests are 
 		received, this ID is used to find the user, which will be restored 
 		to req.user.
	*/
	passport.serializeUser(function (user, done) {
		console.log('serializing: ' + user);
		done(null, user._id);
	});

	/*
		intended to return the user profile based on the id that was serialized 
		to the session.
	*/
	passport.deserializeUser(function(id, done) {
		console.log('deserializing: ' + id);
		// NOT GOOD checks fbusers first then regualar users.
		// REALLY REALLY BAD
		TWUser.findById(id, function(err, user) {
			if (err) done(err);
			if (user) {
				done(null, user)
			} else {
				FBUser.findById(id, function(err, user) {
					if (err) done(err);
					if (user) {
						done(null, user);
					} else {
						User.findById(id, function (err, user) {
							if (err) done(err);
							done(null, user);
						});
					}
				});
			}
		});
		
	});


	// logic for local username/password login
	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'userpassword'
	}, function(username, password, callback) {
			console.log('authenticating.. : ' + username)
			User.findOne({username: username}, function(err, user) {
				if (err) return callback(err);

				if (!user) {
					// the username doesn't exist
					return callback(null, false, {message: 'Username not found'});
				}

				// user exists, check for password match
				user.comparePassword(password, function(err, isMatch) {
					if (err) return callback(err);
					console.log(isMatch + ' ' + password);
					if (isMatch) {
						// correct password
						return callback(null, user);
					}

					// password incorrect
					return callback(null, false, {message: 'Password not found'});
				});
			});
		}
	));

	// Logic for facebook strategey
	passport.use(new FacebookStrategy({
		clientID: '496630153783922',
		clientSecret: '777565cc0f54529a51ffd42ea999dd63',
		callbackURL: 'http://localhost:8888/auth/facebook/callback'
	}, function(accessToken, refreshToken, profile, done) {
		FBUser.findOne({fbId : profile.id }, function(err, oldUser) {
			console.log('facebook check');
			if (oldUser) {
				return done(null, oldUser);
			} else {
				if (err) return  done(err);
				// makes a new entry in the DB with DIFFERNT schema
				console.log(profile);
				var newUser = new FBUser({
					fbId: profile.id,
					email: profile.emails[0].value,
					name: profile.displayName
				}).save(function(err, newUser) {
					if (err) throw err;
					return done(null, newUser);
				});
			}
		});
	}));

	// Logic for twitter strategy
	passport.use(new TwitterStrategy({
		consumerKey : 'Tb05eSsD5xeONZPgnqRkTA',
		consumerSecret : 'YxbHMY9OYRXxC2kKq5xSHYm1quLaht3Bk1aAA9mDlcc',
		callbackURL: 'http://localhost:8888/auth/twitter/callback'
	}, function(token, tokenSecret, profile, done) {
		TWUser.findOne({twId : profile.id}, function(err, oldUser) {
			if (oldUser) return done(null, oldUser);
			if (err) return done(err);
			var newUser = new TWUser({
				twId: profile.id,
				//email: profile.emails[0].value,
				name: profile.displayName,
				handle: profile.username
			}).save(function(err, newUser) {
				if (err) throw err;
				return done(null, newUser)
			});
		});
	}));
}