/*
    Holds app-wide constants.
    Usage: 
        var Constants = require(./config/Constants);
        console.log(Constants.APP_NAME);
*/

var Constants = {
    // The name of the app
    APP_NAME: "PlaySink", 
    // Used in models/user.js to compute salt for password
    SALT_WORK_FACTOR: 10    
};

// Used for passport facebook strategy
var Facebook = { 
	FB_APP_ID : 496630153783922,
    FB_SECERET_CODE : '777565cc0f54529a51ffd42ea999dd63'
}

var Twitter = {
	TW_CONS_KEY : 'Tb05eSsD5xeONZPgnqRkTA',
	TW_SECRET : 'YxbHMY9OYRXxC2kKq5xSHYm1quLaht3Bk1aAA9mDlcc'
}

module.exports = Constants;