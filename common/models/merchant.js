module.exports = function(Merchant) {
    const merchantHelper = require('../utility/merchant-helper');
    
    Merchant.beforeRemote('create', (context, merchantData, next) => {
        console.log('req body:'+context.req.body);
        console.log('data: '+ merchantData)
        
        merchantHelper.validateFields(context.req.body, next);
    });
};
