var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	created_at: {type: Date, default: Date.now},
	username: {type: String, required: true, unique: true},
	useremail: {type: String, required: true, unique: true},
	userpassword: String
});

module.exports = mongoose.model('User', userSchema);