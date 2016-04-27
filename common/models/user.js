module.exports = function (user) {
	// it cannot override parent message, so i validate manually
	// var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// user.validatesPresenceOf('username', 'email', 'password')
	// user.validatesLengthOf('password', { min: 5, message: { min: 'Minimum Password length is 5' } });
	// user.validatesUniquenessOf('email', { message: 'Email address already exists' });
	// user.validatesUniquenessOf('username', { message: 'Username already exists' });
	// user.validatesFormatOf('email', {with: regex, message: 'Invalid email format'});

	user.beforeRemote('create', function (context, userData, next) {
		validateInstance(context.req.body, next);
		next();
	})

	function validateInstance(body, next) {
		var messages = new Object;
		var codes = new Object;
		var message;
		var code;
		
		var isValid = true;
		

		if (typeof (body.username) == 'undefined' || body.username == '') {
			codes.username = [];
			code = 'USERNAME_IS_EMPTY';
			codes.username.push(code);

			messages.username = [];
			message = 'Username is required';
			messages.username.push(message);
			isValid = false;
		}

		if (typeof (body.email) == 'undefined' || body.email == '') {
			codes.email = [];
			code = 'EMAIL_IS_EMPTY'
			codes.email.push(code);

			messages.email = [];
			message = 'Email is required';
			messages.email.push(message);
			isValid = false;
		} else {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(body.email)) {
				codes.email = [];
				code = 'INVALID_EMAIL_FORMAT'
				codes.email.push(code);

				messages.email = [];
				message = 'Invalid email format';
				messages.email.push(message);
				isValid = false;
			}
		}

		if (typeof (body.password) == 'undefined' || body.password == '') {
			codes.password = [];
			code = 'PASSWORD_IS_EMPTY';
			codes.password.push(code);

			messages.password = [];
			message = 'Password is required';
			messages.password.push(message);
			isValid = false;
		}

		if (!isValid) {
			var error = new Error();
			error.name = 'ValidationError';
			error.message = "The model instance is not valid. See error object 'details' property for more info.";
			error.status = 422;
			error.details = new Object();
			error.details.codes = codes;
			error.details.messages = messages;

			return next(error);
		}
	}
};
