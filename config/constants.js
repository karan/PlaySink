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
    SALT_WORK_FACTOR: 10,
    // Appid and secret are used to connect with facebook app, can't be shared
    Facebook: {
        APPID : '496630153783922',
        SECRET : '777565cc0f54529a51ffd42ea999dd63',
        CALLBACK : 'http://localhost:8888/auth/facebook/callback'
    },
    // Key and secret used to connect to twitter app, can't be shared
    Twitter: {
        KEY : 'Tb05eSsD5xeONZPgnqRkTA',
        SECRET : 'YxbHMY9OYRXxC2kKq5xSHYm1quLaht3Bk1aAA9mDlcc',
        CALLBACK : 'http://localhost:8888/auth/twitter/callback'
    },
    // Realm is the domain of website
    Google: {
        CALLBACK : 'http://localhost:8888/auth/google/callback',
        REALM : 'http://localhost:8888'
    },
    SoundCloud: {
        CLIENT_ID: 'edefe43facff0422cfa99623ffec3ab4',
        SECRET: '6addbcd67ae57b6b89afd7f877126357'
    }
};

module.exports = Constants;