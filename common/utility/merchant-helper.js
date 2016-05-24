"use strict";

class MerchantHelper {
    /**
     * Validate merchant's fields
     */
    static validateFields(merchant, next) {
        const messages = new Object;
        const codes = new Object;
        let message;
        let code;

        let isValid = true;
        console.log("merchant: "+merchant.name);
        if (typeof (merchant.name) == 'undefined' || merchant.name == '') {
            codes.name = [];
            code = 'NAME_IS_EMPTY';
            codes.name.push(code);

            messages.name = [];
            message = 'Name is required';
            messages.name.push(message);
            isValid = false;
        }

        if (typeof (merchant.email) == 'undefined' || merchant.email == '') {
            codes.email = [];
            code = 'EMAIL_IS_EMPTY'
            codes.email.push(code);

            messages.email = [];
            message = 'Email is required';
            messages.email.push(message);
            isValid = false;
        } else {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(merchant.email)) {
                codes.email = [];
                code = 'INVALID_EMAIL_FORMAT'
                codes.email.push(code);

                messages.email = [];
                message = 'Invalid email format';
                messages.email.push(message);
                isValid = false;
            }
        }

        if (typeof (merchant.merchantType) == 'undefined' || merchant.merchantType == '') {
            codes.merchantType = [];
            code = 'MERCHANT_TYPE_IS_EMPTY';
            codes.merchantType.push(code);

            messages.merchantType = [];
            message = 'Merchant type is required';
            messages.merchantType.push(message);
            isValid = false;
        }

        if (typeof (merchant.deliveryMethod) == 'undefined' || merchant.deliveryMethod == '') {
            codes.deliveryMethod = [];
            code = 'DELIVERY_METHOD_IS_EMPTY';
            codes.deliveryMethod.push(code);

            messages.deliveryMethod = [];
            message = 'Delivery method is required';
            messages.deliveryMethod.push(message);
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
    }
}

module.exports = MerchantHelper;