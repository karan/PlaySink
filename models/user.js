var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	created_at: { type: Date, default: Date.now },
	username: String,
	useremail: String,
	userpassword: String
});

module.exports = mongoose.model('User', userSchema);