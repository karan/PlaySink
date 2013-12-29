//TODO: Validate email
//TODO: Validate username, password

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs'); // http://codahale.com/how-to-safely-store-a-password/
var validate = require('mongoose-validator').validate;

var SALT_WORK_FACTOR = 10;
var MAX_LOGIN_ATTEMPTS = 5;
var LOCK_TIME = 60 * 60 * 1000; // 1 hour


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
	},
	// to lock account after some number of failed attempts
	loginAttemps: {
		type: Number, 
		default: 0
	}, 
	lockUntil: {
		type: Number
	}
});


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



// checks and returns if the user is locked or not
userSchema.virtual('isLocked').get(function() {
	// check for a future lockUntil timestamp
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

// reasons for a failed login
userSchema.statics.failedLogin = {
	NOT_FOUND: 0, // username not found
	PASSWORD_INCORRECT: 1, // duhh
	MAX_ATTEMPTS: 2 // max attemps already reached
};

// increments login attempts
userSchema.methods.incLoginAttemps = function(callback) {
	// if we have a previous lock that has expired, start at 1
	if (this.lockUntil && this.lockUntil < Date.now()) {
		return this.update({
			$set: {loginAttemps: 1},
			$unset: {lockUntil: 1}
		}, callback);
	}

	// otherwise, we increment
	var updates = {$inc: {loginAttemps: 1}};
	// lock the account if max attemps reached and not already locked
	if (this.loginAttemps + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
		updates.$set = {lockUntil: Date.now() + LOCK_TIME};
	}
	return this.update(updates, callback);
};

// gets authenticated user, error otherwise
// http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
userSchema.statics.getAuthenticated = function(username, password, callback) {
	this.findOne({username: username}, function(err, user) {
		if (err) return callback(err);

		// make sure the user exists
		if (!user) {
			return callback(null, null, reasons.NOT_FOUND);
		}

		// check if account not already locked
		if (!user.isLocked) {
			// increment login attemps if already locked
			return user.incLoginAttemps(function(err) {
				if (err) return callback(err);
				return callback(null, null, reasons.MAX_ATTEMPTS);
			});
		}

		// test for a matching password
		user.comparePassword(password, function(err, isMatch) {
			if (err) return callback(err);

			// check if password was a match
			if (isMatch) {
				// if there's no lock or failed attempts, return user
				if (!user.loginAttemps && !user.lockUntil) return callback(null, user);

				// reset attemps and lock ingo
				var updates = {
					$set: {loginAttemps: 0},
					$unset: {lockUntil: 1}
				};
				return user.update(updates, function(err) {
					if (err) return callback(err);
					return callback(null, user);
				});
			}

			// password incorrect, so increment login attempts
			user.incLoginAttemps(function(err) {
				if (err) return callback(err);
				return callback(null, null, reasons.PASSWORD_INCORRECT);
			});
		});
	});
};

module.exports = mongoose.model('User', userSchema);