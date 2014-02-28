var mongoose = require('mongoose');
var User = require('./../models/user');

/*
    Renders the signup page.
    View: /users/signup
*/
exports.signup = function(req, res) {
    // is a user is already logged in, take him to dashboard
    if (req.isAuthenticated()) res.redirect('dashboard');
    // otherwise, render the page
    res.render('users/signup', {
        title: 'Sign Up',
        messages: req.flash('error')
    });
}

/*
    Renders the signin page. Signin form is on homepage.
    View: users/signin
*/
exports.signin = function(req, res) {
    // is a user is already logged in, take him to dashboard
    if (req.isAuthenticated()) res.redirect('dashboard');
    // otherwise, render the page
    res.render('users/signin', {
        title: 'Sign In',
        messages: req.flash('error')
    });
}

/*
    POST new user to db.
    Returns {'response': 'OK', user: {...}} if successful,
    {'response': 'FAIL'} if signup failed.
*/
exports.adduser = function(req, res) {
    // get the form values from "name" attribute of the form
    var user = new User({
        'username': req.body.username,
        'password': req.body.userpassword,
        'email': req.body.useremail,
        'strategy': 'local'
    });

    console.log(user.username);

    user.save(function(err) {
        if (err) {
            console.log('got into error');
            if (err.code == 11000) {
                console.log('\n----' + err + '---');
                res.json({
                    'response': 'FAIL',
                    'errors': ["User already exists"]
                });
            } else {
                console.log(err);
                var fail_msgs = [];
                for (var field in err.errors) {
                    fail_msgs.push(err.errors[field].message);
                }
                res.json({
                    'response': 'FAIL',
                    'errors': fail_msgs
                });
            }
        } else {
            req.logIn(user, function(err) {
                // successful registration
                res.json({
                    'response': 'OK',
                    'user': user
                });
            });
        }
    });
}

/*
    Logout the user and redirect to homepage.
*/
exports.logout = function(req, res) {
    if (req.isAuthenticated()) req.logout();
    res.json({
        'response': 'OK'
    });
}

/*
    POST the updated user info in db.
    Returns {'response': 'OK', user: {...}} if successful,
    {'response': 'FAIL'} if signup failed.
*/
exports.update_user = function(req, res) {
    User.findById(req.user.id, function(error, doc) {
        if (error) {
            res.json({
                'response': 'FAIL',
                'errors': []
            });
        } else {
            console.log(doc);

            doc.password = req.body.newuserpassword || '';
            doc.email = req.body.newuseremail || '';

            console.log(doc);

            doc.save(function(err) {
                if (err) {
                    console.log(err);
                    var fail_msgs = [];
                    for (var field in err.errors) {
                        fail_msgs.push(err.errors[field].message);
                    }
                    res.json({
                        'response': 'FAIL',
                        'errors': fail_msgs
                    });
                } else {
                    res.json({
                        'response': 'OK',
                        'user': doc
                    });
                }
            });
        }
    })

}

/*
    POST the user likes to the DB.
    Returns {'response': 'OK', user: {...}} if successful,
    {'response': 'FAIL'} if signup failed.
*/
exports.put_likes = function(req, res) {
    console.log(req.body);
    User.findById(req.user.id, function(error, doc) {
        if (error) {
            res.json({
                'response': 'FAIL',
                'errors': []
            });
        } else {
            doc.likes_artists = req.body.likes_artists;
            doc.likes_genres = req.body.likes_genres;
            console.log(doc);
            doc.save(function(err) {
                if (err) {
                    console.log(err);
                    var fail_msgs = [];
                    for (var field in err.errors) {
                        fail_msgs.push(err.errors[field].message);
                    }
                    res.json({
                        'response': 'FAIL',
                        'errors': fail_msgs
                    });
                } else {
                    User.findById(req.user.id, function(error, doc) {
                        res.json({
                            'response': 'OK',
                            'user': doc
                        });
                    });
                }
            });
        }
    });
}