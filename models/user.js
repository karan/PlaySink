var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs'); // http://codahale.com/how-to-safely-store-a-password/
var validate = require('mongoose-validator').validate;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var SALT_WORK_FACTOR = 10;


var nameValidator = [validate({message: "Username should be between 4 and 30 characters."}, 'len', 4, 30), validate('isAlphanumeric')];
var emailValidator = [validate({message: "Enter a valid email address."}, 'isEmail')];
var passwordValidator = [validate({message: "Password should be at least 8 characters."}, 'len', 8, 64)];

var userSchema = new Schema({
	created_at: {
		type: Date, 
		default: Date.now
	},
	username: {
		type: String, 
		required: '{PATH} is required!', 
		unique: true,
		validate: nameValidator
	},
	email: {
		type: String, 
		required: '{PATH} is required!', 
		unique: true,
		validate: emailValidator
	},
	password: {
		type: String, 
		required: '{PATH} is required!',
		validate: passwordValidator
	}
});


// reasons for a failed login
var reasons = userSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
};

// the below 3 validations only apply if you are signing up traditionally
userSchema.path('username').validate(function(value, respond) {
	mongoose.model('User', userSchema).findOne({username: value}, function(err, user) {
		if(err) throw err;
		if(user) return respond(false);
		respond(true);
	});
}, 'That username is taken.');

userSchema.path('email').validate(function(value, respond) {
	mongoose.model('User', userSchema).findOne({email: value}, function(err, user) {
		if(err) throw err;
		if(user) return respond(false);
		respond(true);
	});
}, 'That email is associated with another account.');


// Always hash a password before saving it to db
// Mongoose middleware is not invoked on update() operations, 
// so you must use a save()if you want to update user passwords.
userSchema.pre('save', function(next) {
	var user = this;
	// only hash this password if it has been modified, or is new
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with hashed one
			user.password = hash;
			next();
		});
	});
});

// compare two passwords for a match
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};


/*
// gets authenticated user, error otherwise
// http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
userSchema.statics.getAuthenticated = function(username, password, callback) {
	this.findOne({username: username}, function(err, user) {
		if (err) return callback(err);

		// make sure the user exists
		if (!user) {
			return callback(null, null, reasons.NOT_FOUND);
		}

		// test for a matching password
		user.comparePassword(password, function(err, isMatch) {
			if (err) return callback(err);

			// check if password was a match
			if (isMatch) {
				return callback(null, user);
			}

			// password incorrect
			return callback(null, null, reasons.PASSWORD_INCORRECT);
		});
	});
};*/

passport.use(new LocalStrategy(
	function(username, password, callback) {
		this.findOne({username: username}, function(err, user) {
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
					return callback(null, user);
				}

				// password incorrect
				return callback(null, false, {message: reasons.PASSWORD_INCORRECT});
			}); // end comparePassword
		}); // end findOne
	}
));

module.exports = mongoose.model('User', userSchema);