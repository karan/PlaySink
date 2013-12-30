
/*
*  Generic require login routing middleware
*/
exports.requiresLogin = function (req, res, next) {
	if (req.isAuthenticated()) {return next();}
	
	req.flash('error', "Sign in before you have fun.");
	res.redirect('/signin');
}