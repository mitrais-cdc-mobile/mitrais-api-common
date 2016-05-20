"use strict"

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
};
