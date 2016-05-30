"use strict"

var config = require('../../server/config.json');
var app = require('../../server/server');

module.exports = (user) => {
    const userHelper = require('../utility/user-helper');

    // Disable remote methods
    userHelper.disableRemoteMethods(user);

    /**
     * check whether the request is valid or not. 
     */
    user.beforeRemote('create', (context, userData, next) => {
        userHelper.validateFields(context.req.body, next);
    });

    /**
     * Send a verification email after registration 
     */
    user.afterRemote('create', (context, userInstance, next) => {
        if ((userInstance.__data) && (userInstance.__data.email) && (userInstance.__data.accountType)) {
            if ((process.env.MITMART_SIGNUP_AUTOVERIFICATION) && (process.env.MITMART_SIGNUP_AUTOVERIFICATION == "true")) {
                userHelper.autoVerify(userInstance, next);
            } else {
                userHelper.sendVerificationEmail(userInstance, next);
            }
        } else {
            next()
        };
    });

    //reset the user's password
    user.beforeRemote('generateNewPassword', function (context, userInstance, next) {
        try {
            var accessToken = app.models.AccessToken;
            
            //check whether there is accessToken header or not
            if (!context.req.query.accessToken) {
                return context.res.sendStatus(401);
            }
            else {
                //check whether access token is valid or not
                accessToken.findById(context.req.query.accessToken, function (err, accessTokenResult) {

                    //if the access token already saved in database
                    if (accessTokenResult != null) {

                        //validate access token
                        accessTokenResult.validate(function (err, isValid) {

                            //when access token is valid
                            if (isValid) {

                                //find user by request body user Id
                                user.findById(accessTokenResult.userId, function (err, userResult) {

                                    //return not found when user with the id not found in database
                                    if (err) return context.res.sendStatus(404);

                                    //update user password
                                    var shortid = require('shortid');
                                    var newPassword = shortid.generate();

                                    userResult.updateAttribute('password', newPassword, function (err, userUpdateResult) {
                                        if (err) return context.res.sendStatus(404);

                                        console.log('> password reset processed successfully');

                                        var html = 'Hi ' + userUpdateResult.__data.username + ' your new password is: ' + newPassword;

                                        user.app.models.Email.send({
                                            to: userUpdateResult.__data.email,
                                            from: 'noreply@mitmart.com',
                                            subject: 'Mitmart - Your New Password',
                                            html: html
                                        }, function (err) {
                                            if (err)
                                                return console.log('>error sending new password: ', err);
                                        });

                                        return context.res.sendStatus(200);
                                    });

                                });

                            }

                            //when access token is invalid
                            else {
                                return context.res.sendStatus(401);
                            }
                        })
                    }

                    //when access token is not available in the database
                    else {
                        return context.res.sendStatus(401);
                    }
                })
            }
        }
        catch (exception) {
            return context.res.sendStatus(401);
        }
    });

    //send password reset link when requested
    user.on('resetPasswordRequest', function (info) {
        var url = 'http://' + config.host + ':' + config.port + '/api/users/generateNewPassword';

        var html = 'Hi ' + info.user.__data.username + ' you have requested to reset your password,' + ' please click <a href="' + url + '?accessToken=' +
            info.accessToken.id + '">here</a> to reset your password';
        user.app.models.Email.send({
            to: info.email,
            from: 'noreply@mitmart.com',
            subject: 'Mitmart - Password Reset Request',
            html: html
        }, function (err) {
            if (err)
                return console.log('>error sending password reset email, sending password reset email to: ', info.email, ' error:' , err);
        });
    });

    // create new method generate new password
    user.remoteMethod('generateNewPassword', {
        description: 'Generate New Password',
        accepts: [
            { arg: 'Objects', type: 'object', required: true, http: { source: 'body' } }],

        http: { verb: 'get' }
    }
    );
};



