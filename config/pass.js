/*
	This is a wrapper for all code used for user authentication.
*/

// All Passport stategies being used
var LocalStrategy = require('passport-local').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	GoogleStategy = require('passport-google').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	SoundCloudStrategry = require('passport-soundcloud').Strategy;

// bring in the schema for user
var User = require('mongoose').model('User'),
	Constants = require('./constants');

module.exports = function (passport) {

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
		User.findById(id, function (err, user) {
			if (err) done(err);
			done(null, user);
		});
	});
	
	// logic for local username/password login
	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'userpassword'
	}, function(username, password, callback) {
			console.log('authenticating.. LocalStrategy: ' + username)

			// user can also login using email/password
			var conditions = {}
			if (username.indexOf('@') == -1) {
				// it's not an email
				conditions.username = username;
			} else {
				conditions.email = username;
			}

			User.findOne(conditions, function(err, user) {
				if (err) return callback(err);

				if (!user) {
					// the user doesn't exist
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

	// Logic for facebook strategy
	passport.use(new FacebookStrategy({
		clientID: Constants.Facebook.APPID,
		clientSecret: Constants.Facebook.SECRET,
		callbackURL: Constants.Facebook.CALLBACK
	}, function(accessToken, refreshToken, profile, done) {
		console.log('facebook authentication for ')
		console.log(profile);
		User.findOne({$or: [{fbId : profile.id }, {email: profile.emails[0].value}]}, function(err, oldUser) {
			if (oldUser) {
				return done(null, oldUser);
			} else {
				if (err) return done(err);
				var newUser = new User({
					fbId: profile.id,
					email: profile.emails[0].value,
					username: profile.emails[0].value.split('@')[0], // Temp username
					strategy: 'facebook'
				}).save(function(err, newUser) {
					if (err) return done(err);
					return done(null, newUser);
				});
			}
		});
	}));

	// Logic for twitter strategy
	passport.use(new TwitterStrategy({
		consumerKey : Constants.Twitter.KEY,
		consumerSecret : Constants.Twitter.SECRET,
		callbackURL: Constants.Twitter.CALLBACK
	}, function(token, tokenSecret, profile, done) {
		console.log('twitter authentication for ');
		console.log(profile);
		User.findOne({twId : profile.id}, function(err, oldUser) {
			if (oldUser) return done(null, oldUser);
			if (err) return done(err);

			// If user doesn't exist create a new one
			var newUser = new User({
				twId: profile.id,
				//email: profile.emails[0].value, no email :(
				username: profile.username, // Temporary username
				strategy: 'twitter'
			}).save(function(err, newUser) {
				if (err) throw err;
				return done(null, newUser);
			});
		});
	}));

	// Logic for google strategy
	passport.use(new GoogleStategy({
		returnURL: Constants.Google.CALLBACK,
		realm: Constants.Google.REALM
	}, function(identifier, profile, done) {
		console.log('google authentication for ');
		console.log(profile);
		// Extracts the openID from url
		identifier = identifier.split('?id=')[1];
		User.findOne({$or: [{openId: identifier}, {email: profile.emails[0].value}]}, function(err, oldUser) {
			if (oldUser) return done(null, oldUser);
			if (err) return done(err);

			// If there is no user found, create a new one
			var newUser = new User({
				openId: identifier,
				email: profile.emails[0].value,
				// Temporary username
				username: profile.name.familyName + '_' + profile.name.givenName,
				strategy: 'google'
			}).save(function(err, newUser) {
				if (err) throw err;
				return done(null, newUser);
			});
		});
	}));

	// Logic for Sound Cloud strategry
	passport.use(new SoundCloudStrategry({
		clientID: Constants.SoundCloud.CLIENT_ID,
		clientSecret: Constants.SoundCloud.SECRET,
		callbackURL: Constants.SoundCloud.CALLBACK
	},
	function(accessToken, refreshToken, profile, done) {
		console.log('soundcloud auth for');
		console.log('un ' + profile._json.username);

		
		User.findOne({scId : profile.id}, function(err, oldUser) {
			if (oldUser) return done(null, oldUser);
			if (err) return done(err);

			// If user doesn't exist create a new one
			var newUser = new User({
				username: profile._json.username,
				scId: profile.id,
				email: profile._json.username + '@sc.com',
				strategy: 'soundcloud'
			}).save(function(err, newUser) {
				if (err) throw err;
				return done(null, newUser);
			});
		});
	}));
}