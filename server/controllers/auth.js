var User = require('../models/User');
var jwt = require('jwt-simple');
var config = require('../config');

// route to authenticate a user (POST http://localhost:8080/app_api/authenticate)
//authorise the user to be able to use the app
module.exports.authUser = function(request, response) {

    //Search to identify user
    User.findOne({
        phone_number: request.body.phone_number
    }, function(err, user) {

        //If we have an error, or the username is not present provide feedback.
        if (err) throw err;
        if (!user) {
            response.send({
                success: false,
                msg: 'Authentication failed.'
            });

        } else {

            //Encode the information
            var token = jwt.encode(user, config.secret);

            // return the information including token as JSON
            response.json({
                success: true,
                token: 'JWT ' + token,
                msg: ""
            });
        }
    });
};

// create a new user account (POST http://localhost:8080/app_api/user/)
module.exports.userCreate = function(request, response) {
    
    //Collect the body information
    var reqBody = request.body;

    // Create a new user based on form parameters
    var user = new User({
        username: reqBody.username,
        phone_number: reqBody.phone_number,
        country_code: reqBody.country_code
    });

    if (!reqBody.username) {
        response.json({
            success: false,
            msg: 'Please pass username'
        });
    } else if (!reqBody.phone_number) {
        response.json({
            success: false,
            msg: 'Please pass mobile number.'
        });
    } else {

        user.save(function(err, doc) {
            if (err) {
                if (err.code == 11000) {

                    User.findOne({phone_number:reqBody.phone_number}, (err, doc)=> {
                      
                        sendTextMessage(user, response, doc)
                    });
                    
                } else {
                    //Throw error message if not known
                    response.send({
                        success: false,
                        msg: err
                    });
                }
            } else {
                sendTextMessage(user, response, doc)
            }
        });
    }
};


function sendTextMessage(user, response, doc) {
    //We may not to want to always send SMS messages.
    if (config.enableValidationSMS == 1) {
        // If the user is created successfully, send them an account
        // verification token
        user.sendAuthyToken(function(err) {
            if (err) {
                response.send({
                    success: false,
                    msg: err
                });
            } else {
                // Send for verification page
                response.send({
                    success: true,
                    msg: {
                        msg: doc._id
                    }
                });
            }
        });
    } else {

        //If we do not want to enable sms verification lets register and send confirmation
        response.send({
            success: true,
            msg: {
                msg: "Account created (SMS validation false)"
            }
        });
    }
}

// Require sms verification (POST http://localhost:8080/app_api/user/:id/verify)
// Handle submission of verification token
module.exports.verify = function(request, response) {
    var user;

    // Load user model
    User.findById(request.params.id, function(err, doc) {
        if (err || !doc) {
            return response.send({
                success: false,
                msg: "User not found for this ID"
            });
        }

        // If we find the user, let's validate the token they entered
        user = doc;
        user.verifyAuthyToken(request.body.code, postVerify);
    });

    // Handle verification response
    function postVerify(err) {
        if (err) {
            return response.send({
                success: false,
                msg: "The token you entered was invalid - please retry."
            });
        }

        // If the token was valid, flip the bit to validate the user account
        user.verified = true;
        user.save(postSave);
    }

    // after we save the user, handle sending a confirmation
    function postSave(err) {
        if (err) {
            return response.send({
                success: true,
                msg: "There was a problem validating your account."
            });
        }

        // Send confirmation text message
        var message = 'You did it! Login was successful :)';
        user.sendMessage(message, function(err) {
            if (err) {
                return response.send({
                    success: true,
                    msg: "You are logged in, but we could not send you a text message. Our bad."
                });
            }
            // show success page
            response.send({
                success: true,
                msg: message
            });
        });
    }

    // respond with an error not current used
    function die(message) {
        response.send({
            success: false,
            msg: message
        });
    }

};

// Provide user details (GET http://localhost:8080/app_api/user/)
module.exports.getUser = function(request, response) {

    //Obtain the header token for authentication
    var token = getToken(request.headers);

    if (token) {
        //Seek to decode the token
        var decoded = jwt.decode(token, config.secret);

        //By decoding the secret key we should be able to find the user
        User.findById(
            decoded.id,
            function(err, user) {
                if (err) throw err;
                if (!user) {

                    //Take note of the status header
                    //Return response
                    return response.status(403).send({
                        success: false,
                        msg: 'Authentication failed.'
                    });
                } else {

                    //Build user payload and return to user
                    response.json({
                        success: true,
                        msg: {
                            username: user.username,
                            smsmobile: user.phone_number
                        }
                    });

                }
            });
    } else {

        //Return user response
        return response.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
};

//Obtain the user token ready for authorisation.
//This splits the header to ensure we are able to obtain the unique parts
getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};