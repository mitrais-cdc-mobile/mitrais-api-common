"use strict"

var config = require('../../server/config.json');

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

    //send password reset link when requested
    user.on('resetPasswordRequest', function (info) {
        var url = 'http://' + config.host + ':' + config.port + '/reset-password';
        var html = 'Click <a href="' + url + '?access_token=' +
            info.accessToken.id + '">here</a> to reset your password';
        user.app.models.Email.send({
            to: info.email,
            from: info.email,
            subject: 'Password reset',
            html: html
        }, function (err) {
            if (err) 
            return console.log('>error sending password reset email, sending password reset email to:', info.email, err);
        });
    });
};
