module.exports = function(Merchant) {
    const merchantHelper = require('../utility/merchant-helper');
    
    Merchant.beforeRemote('create', (context, merchantData, next) => {
        merchantHelper.validateFields(context.req.body, next);
    });
};
