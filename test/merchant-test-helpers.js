"use strict"

const app = require('../server/server');

/**
 * A collection of methods that can be used to support running Merchant model's integration tests.
 */
class MerchantTestHelpers {
    /**
     * A helper for creating user account for testing purpose
     */
    static createTestMerchantAccount(name, email, merchantType, userId, deliveryMethod) {
        return new Promise((resolve, reject) => {
            let merchant = app.models.Merchant;
            const createRequest = { 
                name: name, 
                email: email, 
                merchantType: merchantType, 
                deliveryMethod: deliveryMethod, 
                userId: userId 
            };
            
            merchant.create(createRequest,
                (err, res) => {
                    if (err) reject(err);
                    // return user id
                    const merchantId = res.id;
                    resolve(merchantId);
                });
        });
    };
    
    /**
     * dispose merchant by name
     */
    static disposeTestMerchantAccountByName(name) {
        let Merchant = app.models.Merchant;

        Merchant.destroyAll({ 'name': name },
            (err, obj, count) => {
                if (err) throw err;
            });
    }
}

module.exports = MerchantTestHelpers;