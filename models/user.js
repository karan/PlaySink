/*
	Schema for a user.
	Implements field validations, saving to database and
	password comparing.
*/

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,		// Each schema maps to a MongoDB collection
	bcrypt = require('bcryptjs'),	// used to hash password // http://codahale.com/how-to-safely-store-a-password/
	Constants = require('./../config/constants'); // the file containing out app constants

/*
	Field validators
*/

// Username validators
var nameValidator = [
	{
		validator: function (username) {
			username = username.toLowerCase();
			return username && username.length > 3 && username.length < 31;
		},
		msg: 'Username should be between 4 and 30 characters.'
	},
	{
		validator: function (username) {
			username = username.toLowerCase();
			var reservedWords = ['login', 'logout', 'admin', 'signup'];
			return reservedWords.indexOf(username) === -1;
		},
		msg: 'Username contains a reserved word.'
	},
	{
		validator: function (username) {
			return (/^[a-zA-Z0-9\_]+$/).test(username);
		},
		msg: 'Username can only contain alphabets, numbers and underscore.'
	}
];

// Email validators
var emailValidator = [
	{
		validator: function (email) {
			// http://stackoverflow.com/questions/46155/
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA -Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},
		msg: 'Email is invalid.'
	}
];

// Password validators
var passwordValidator = [
	{
		validator: function (password) {
			return password && password.length >= 8;
		},
		msg: 'Password should be at least 8 characters.'
	}
];

// For local Strategy
var userSchema = new Schema({
	created_at: {
		// auto added user registration timestamp
		type: Date, 
		default: Date.now
	},
	username: {
		type: String, 
		//required: '{PATH} is required!', 
		//validate: nameValidator
	},
	email: {
		type: String, 
		required: '{PATH} is required!', 
		lowercase: true, // force email lowercase
		validate: emailValidator
	},
	password: {
		type: String, 
		required: '{PATH} is required!',
		validate: passwordValidator
	}
});

// the below 2 validations only apply if you are signing up traditionally
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
	bcrypt.genSalt(Constants.SALT_WORK_FACTOR, function(err, salt) {
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

module.exports = mongoose.model('User', userSchema);
// Need to integrate with user
var FBUserSchema = new Schema({
	created_at: {
		// auto added user registration timestamp
		type: Date, 
		default: Date.now
	},
	fbId: String,
	email: {
		type: String, 
		required: '{PATH} is required!', 
		lowercase: true, // force email lowercase
	},
	name: String
});

module.exports = mongoose.model('FBS', FBUserSchema);