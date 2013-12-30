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

module.exports = Constants;