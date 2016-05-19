"use strict";

const app = require('../../server/server');
const config = require('../../server/config');
class UserHelper {
    /**
     * Validate user's fields
     */
    static validateFields(user, next) {
		const messages = new Object;
		const codes = new Object;
		let message;
		let code;

		let isValid = true;

		if (typeof (user.username) == 'undefined' || user.username == '') {
			codes.username = [];
			code = 'USERNAME_IS_EMPTY';
			codes.username.push(code);

			messages.username = [];
			message = 'Username is required';
			messages.username.push(message);
			isValid = false;
		}

		if (typeof (user.email) == 'undefined' || user.email == '') {
			codes.email = [];
			code = 'EMAIL_IS_EMPTY'
			codes.email.push(code);

			messages.email = [];
			message = 'Email is required';
			messages.email.push(message);
			isValid = false;
		} else {
			const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(user.email)) {
				codes.email = [];
				code = 'INVALID_EMAIL_FORMAT'
				codes.email.push(code);

				messages.email = [];
				message = 'Invalid email format';
				messages.email.push(message);
				isValid = false;
			}
		}

		if (typeof (user.password) == 'undefined' || user.password == '') {
			codes.password = [];
			code = 'PASSWORD_IS_EMPTY';
			codes.password.push(code);

			messages.password = [];
			message = 'Password is required';
			messages.password.push(message);
			isValid = false;
		}

		if (typeof (user.accountType) == 'undefined' || user.accountType == '') {
			codes.accountType = [];
			code = 'ACCOUNT_TYPE_IS_EMPTY';
			codes.accountType.push(code);

			messages.accountType = [];
			message = 'Account Type is required';
			messages.accountType.push(message);
			isValid = false;
		}

		if (!isValid) {
			let error = new Error();
			error.name = 'ValidationError';
			error.message = "The model instance is not valid. See error object 'details' property for more info.";
			error.status = 422;
			error.details = new Object();
			error.details.codes = codes;
			error.details.messages = messages;

			return next(error);
		}

        return next();
    };

    /**
     * Send verification email
     */
    static sendVerificationEmail(userInstance, next) {
        //set the options of the email     
        const options = {
            type: 'email',
            to: userInstance.__data.email,
            from: 'noreply@mitmart.com',
            subject: 'Thank you for registering.',
            redirect: '/verified'
        };

		// Call userInstance's verify method
		userInstance.verify(options, (err, response) => {
			if (err) return next(err);

			console.log('[DEBUG] - Verification email has been sent: ', response);

			return next();
		});
    };

	/**
	 * Auto verify email
	 */
	static autoVerify(userInstance, next) {
		userInstance.verificationToken = undefined;
		userInstance.emailVerified = true;
		userInstance.save(function (err) {
            if (err) {
				return next(err);
            }
		});
		return next();
	};

	/**
	 * Send Registration Result
	 */
	static sendMerchantRegistrationResult(context, userInstance, next) {
		let ttl = config.authTempTokenTtl;
		let userModel = app.models.User;
		userModel.findOne({ where: { email: userInstance.__data.email } }, function (err, user) {
			if (err) {
				return cb(err);
			}
			user.accessTokens.create({ ttl: ttl }, function (err, accessToken) {
				if (err) {
					return next(err);
				}
				context.result.accessToken = accessToken.id;
				return next();
			});
		});

	}

	/**
	 * Disable remote methods
	 */
	static disableRemoteMethods(userModel) {
		// Disable remote methods that related to access tokens. 
		// Why? Because access token is something that should be managed from within the backend.
		userModel.disableRemoteMethod('__count__accessTokens', false);
		userModel.disableRemoteMethod('__create__accessTokens', false);
		userModel.disableRemoteMethod('__delete__accessTokens', false);
		userModel.disableRemoteMethod('__destroyById__accessTokens', false);
		userModel.disableRemoteMethod('__findById__accessTokens', false);
		userModel.disableRemoteMethod('__get__accessTokens', false);
		userModel.disableRemoteMethod('__updateById__accessTokens', false);
	}
};

module.exports = UserHelper;