"use strict"

module.exports = (user) => {
	const userHelper = require('../utility/user-helper');
	
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
        if ( (userInstance.__data) && (userInstance.__data.email) ){
            // By pass verification if $NODE_ENV = testing
            if (process.env.NODE_ENV !== 'testing'){
                // If not, send email verification
                userHelper.sendVerificationEmail(userInstance, next);                
            }
            else next();
        }
        else next();
	});		
};
